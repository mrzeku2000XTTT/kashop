import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { address, amount } = await req.json();

    if (!address || !amount) {
      return Response.json({ 
        error: 'Missing required parameters: address and amount',
        success: false
      }, { status: 400 });
    }

    console.log('Checking payment for:', { address, amount });

    // Use Kaspa explorer API to get address balance and UTXOs
    const apiUrl = `https://api.kaspa.org/addresses/${address}/full`;
    console.log('Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Kaspa API error:', response.status, await response.text());
      return Response.json({ 
        error: `Kaspa API returned status ${response.status}`,
        success: false
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('Kaspa API response:', JSON.stringify(data, null, 2));
    
    // Check if there are any UTXOs
    if (!data.utxos || data.utxos.length === 0) {
      console.log('No UTXOs found for address');
      return Response.json({
        success: false,
        message: 'No payments found for this address',
        address: address,
        expectedAmount: amount,
        checked: new Date().toISOString()
      });
    }

    // Convert expected amount to sompi (1 KAS = 100,000,000 sompi)
    const expectedSompi = Math.floor(amount * 100000000);
    console.log('Expected sompi:', expectedSompi);
    
    // Look for matching UTXO
    let foundPayment = false;
    let matchingTxid = null;
    
    for (const utxo of data.utxos) {
      const utxoAmount = parseInt(utxo.utxoEntry?.amount || 0);
      const difference = Math.abs(utxoAmount - expectedSompi);
      
      console.log('Checking UTXO:', {
        txid: utxo.outpoint?.transactionId,
        amount: utxoAmount,
        expected: expectedSompi,
        difference: difference
      });
      
      // Allow 1% tolerance for network fees
      if (difference <= expectedSompi * 0.01) {
        foundPayment = true;
        matchingTxid = utxo.outpoint?.transactionId;
        console.log('Payment found!', matchingTxid);
        break;
      }
    }

    return Response.json({
      success: foundPayment,
      txid: matchingTxid,
      address: address,
      expectedAmount: amount,
      checked: new Date().toISOString()
    });

  } catch (error) {
    console.error('Payment check error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack,
      success: false 
    }, { status: 500 });
  }
});