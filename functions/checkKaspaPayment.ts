import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { address, amount, minConfirmations = 1 } = await req.json();

    if (!address || !amount) {
      return Response.json({ 
        error: 'Missing required parameters: address and amount' 
      }, { status: 400 });
    }

    // Query Kaspa API for UTXO
    const response = await fetch(`https://api.kaspa.org/addresses/${address}/utxos`);
    
    if (!response.ok) {
      return Response.json({ 
        error: 'Failed to fetch UTXO data from Kaspa API' 
      }, { status: 500 });
    }

    const utxos = await response.json();
    
    // Check if any UTXO matches the expected amount
    const expectedSompi = Math.floor(amount * 100000000); // Convert KAS to sompi
    const tolerance = 100; // Allow small difference for fees
    
    let foundPayment = false;
    let txid = null;
    
    for (const utxo of utxos) {
      const utxoAmount = parseInt(utxo.amount || utxo.utxoEntry?.amount || 0);
      
      if (Math.abs(utxoAmount - expectedSompi) <= tolerance) {
        foundPayment = true;
        txid = utxo.transactionId || utxo.outpoint?.transactionId;
        break;
      }
    }

    return Response.json({
      success: foundPayment,
      txid: txid,
      address: address,
      expectedAmount: amount,
      checked: new Date().toISOString()
    });

  } catch (error) {
    console.error('Payment check error:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});