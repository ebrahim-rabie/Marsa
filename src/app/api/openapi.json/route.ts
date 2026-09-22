import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'Marsa (مرسى) B2B Trade Platform API',
      version: '1.0.0',
      description:
        'Official API specification for Marsa (مرسى), the managed B2B sourcing platform connecting Egyptian buyers and importers with verified Egyptian and Chinese manufacturers. Features staged escrow payments with Paymob Egypt, automated quality inspection reports, and dispute arbitration.',
      contact: {
        name: 'Marsa Engineering & Architecture Team',
        email: 'api@marsa.trade',
        url: 'https://marsa.trade',
      },
      license: {
        name: 'Proprietary',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
        description: 'Active Server',
      },
      {
        url: 'https://marsa.trade',
        description: 'Production Server',
      },
    ],
    tags: [
      {
        name: 'Payments & Escrow',
        description: 'Paymob Egypt Intention API, card/wallet checkout, and HMAC-verified webhooks.',
      },
      {
        name: 'Maintenance & Cron',
        description: 'Background cron maintenance and database keepalive tasks.',
      },
      {
        name: 'Metadata & PWA',
        description: 'App manifest, dynamic icons, and crawler discovery routes.',
      },
    ],
    paths: {
      '/api/payments/paymob/create-intention': {
        post: {
          tags: ['Payments & Escrow'],
          summary: 'Initialize Escrow Payment Intention (Paymob Egypt)',
          description:
            'Creates a payment intention with Paymob Egypt for order deposits (30% escrow). Converts amounts to piasters and supports cards (Visa, Mastercard, Meeza) and Egyptian mobile wallets (Vodafone Cash, Orange, Etisalat, WE). In local sandbox environments without credentials, provides a simulated checkout session.',
          operationId: 'createPaymobIntention',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateIntentionRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Payment intention initialized successfully.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CreateIntentionResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Validation error: Missing required fields.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            '500': {
              description: 'Paymob gateway or server error.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/api/webhooks/paymob': {
        post: {
          tags: ['Payments & Escrow'],
          summary: 'Paymob Transaction Webhook Callback',
          description:
            'Server-to-server callback executed by Paymob upon payment status updates. Verifies the SHA-512 HMAC signature across 20 concatenated fields. If successful, advances order status to Stage 4 (In Production) and records the transaction in the database.',
          operationId: 'paymobWebhook',
          parameters: [
            {
              name: 'hmac',
              in: 'query',
              required: true,
              description: 'Cryptographic SHA-512 HMAC hash provided by Paymob in the callback URL.',
              schema: {
                type: 'string',
                example: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PaymobWebhookPayload',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Webhook received, validated, and processed.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'received' },
                      verified: { type: 'boolean', example: true },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid or missing transaction payload.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            '401': {
              description: 'HMAC signature verification failed.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/api/cron/keepalive': {
        get: {
          tags: ['Maintenance & Cron'],
          summary: 'Supabase Free-Tier Keepalive Ping',
          description:
            'Executes a lightweight query against the companies table to prevent Supabase 7-day auto-pause on free-tier projects. Configured to be called via GitHub Actions or Vercel Cron every 5 days.',
          operationId: 'cronKeepalive',
          security: [
            {
              CronBearerAuth: [],
            },
          ],
          responses: {
            '200': {
              description: 'Keepalive ping executed or skipped safely in sandbox.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CronKeepaliveResponse',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized: Invalid or missing Bearer token.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        CronBearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Token',
          description: 'Bearer token matching the CRON_SECRET environment variable.',
        },
        PaymobHmacQuery: {
          type: 'apiKey',
          in: 'query',
          name: 'hmac',
          description: 'Paymob SHA-512 HMAC query parameter.',
        },
      },
      schemas: {
        CustomerPayload: {
          type: 'object',
          required: ['phone'],
          properties: {
            firstName: { type: 'string', example: 'Ahmed' },
            lastName: { type: 'string', example: 'Hassan' },
            email: { type: 'string', format: 'email', example: 'ahmed@cairoimports.eg' },
            phone: { type: 'string', example: '+201012345678' },
          },
        },
        OrderItemPayload: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Deposit for Order ORD-0042' },
            amountEgp: { type: 'number', example: 225000 },
            quantity: { type: 'integer', example: 1 },
          },
        },
        CreateIntentionRequest: {
          type: 'object',
          required: ['orderNumber', 'amountEgp', 'customer'],
          properties: {
            orderNumber: { type: 'string', example: 'ORD-0042' },
            amountEgp: { type: 'number', example: 225000, description: 'Amount in Egyptian Pounds' },
            customer: { $ref: '#/components/schemas/CustomerPayload' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItemPayload' },
            },
          },
        },
        CreateIntentionResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            clientSecret: { type: 'string', example: 'cs_live_9f82a17b8c2d...' },
            id: { type: 'string', example: '18492041' },
            checkoutUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://accept.paymob.com/unifiedcheckout/?publicKey=pk_live_...&clientSecret=cs_live_...',
            },
            mock: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Checkout generated successfully' },
          },
        },
        PaymobWebhookPayload: {
          type: 'object',
          required: ['obj'],
          properties: {
            type: { type: 'string', example: 'TRANSACTION' },
            obj: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 19482014 },
                amount_cents: { type: 'integer', example: 22500000 },
                success: { type: 'boolean', example: true },
                currency: { type: 'string', example: 'EGP' },
                order: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 8920194 },
                    merchant_order_id: { type: 'string', example: 'ORD-0042' },
                  },
                },
                source_data: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', example: 'card' },
                    pan: { type: 'string', example: '2346' },
                    sub_type: { type: 'string', example: 'MasterCard' },
                  },
                },
              },
            },
          },
        },
        CronKeepaliveResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            message: { type: 'string', example: 'Supabase keepalive ping successful' },
            timestamp: { type: 'string', format: 'date-time', example: '2026-09-22T22:20:00.000Z' },
            rowsChecked: { type: 'integer', example: 1 },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Detailed error explanation' },
            message: { type: 'string', example: 'Optional secondary message' },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json',
    },
  });
}
