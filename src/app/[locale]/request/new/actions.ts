'use server'

import { createClient } from '@supabase/supabase-js'

// Helper to get admin client
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or Service Role Key is missing')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function insertBuyRequest(formData: any) {
  try {
    const supabase = getAdminClient()
    
    // Generate a dummy RFQ number
    const requestNumber = `RFQ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`

    // Insert into buy_requests table
    const { error } = await supabase
      .from('buy_requests')
      .insert({
        request_number: requestNumber,
        product_name: formData.productName,
        category: formData.category,
        specifications: formData.specifications,
        quantity: formData.quantity,
        unit: formData.unit,
        budget_min: formData.budgetMin,
        budget_max: formData.budgetMax,
        currency: formData.currency,
        supplier_preference: formData.supplierPreference,
        delivery_date: formData.deliveryDate,
        notes: formData.notes,
        contact_name: formData.fullName,
        company_name: formData.companyName,
        phone: formData.phone,
        email: formData.email,
        source: formData.source,
        status: 'new'
      })

    if (error) {
      console.error('Error inserting buy request:', error)
      return { success: false, error: 'Failed to insert request' }
    }

    return { success: true, requestNumber }
  } catch (error) {
    console.error('Error in insertBuyRequest:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
