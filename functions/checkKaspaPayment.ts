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

    console.log('Checking payment:', { address, amount });

    // Try multiple Kaspa API endpoints
    const endpoints = [
      `https://api.kaspa.org/addresses/${address}/utxos`,
      `https://api.kaspa.org/addresses/${address}/balance`
    ];

    let utxos = null;
    let lastError = null;

    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log('Trying endpoint:', endpoint);
        const response = await fetch(endpoint, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', JSON.stringify(data).substring(0, 500));
          
          // Handle different response formats
          if (Array.isArray(data)) {
            utxos = data;
          } else if (data.utxos) {
            utxos = data.utxos;
          } else if (data.balance !== undefined) {
            // Balance endpoint - check if balance matches
            const balanceKAS = parseFloat(data.balance) / 100000000;
            console.log('Balance found:', balanceKAS, 'KAS');
            
            if (Math.abs(balanceKAS - amount) < 0.00001) {
              return Response.json({
                success: true,
                address: address,
                expectedAmount: amount,
                foundAmount: balanceKAS,
                method: 'balance_check',
                checked: new Date().toISOString()
              });
            }
          }
          
          if (utxos) break;
        }
      } catch (err) {
        console.error('Endpoint failed:', endpoint, err.message);
        lastError = err;
      }
    }

    if (!utxos) {
      return Response.json({
        success: false,
        error: 'Could not fetch UTXOs from Kaspa network',
        details: lastError?.message,
        address: address,
        checked: new Date().toISOString()
      });
    }

    // Convert expected amount to sompi
    const expectedSompi = Math.floor(amount * 100000000);
    console.log('Looking for amount:', expectedSompi, 'sompi');

    // Check UTXOs for matching payment
    for (const utxo of utxos) {
      const utxoAmount = parseInt(
        utxo.amount || 
        utxo.utxoEntry?.amount || 
        utxo.value || 
        0
      );
      
      const difference = Math.abs(utxoAmount - expectedSompi);
      const tolerance = Math.max(1000, expectedSompi * 0.01); // 1% or 1000 sompi minimum
      
      console.log('UTXO check:', {
        amount: utxoAmount,
        expected: expectedSompi,
        difference: difference,
        tolerance: tolerance
      });

      if (difference <= tolerance) {
        const txid = utxo.transactionId || 
                     utxo.outpoint?.transactionId || 
                     utxo.txid || 
                     'unknown';
        
        console.log('✅ Payment found!');
        return Response.json({
          success: true,
          txid: txid,
          address: address,
          expectedAmount: amount,
          foundAmount: utxoAmount / 100000000,
          checked: new Date().toISOString()
        });
      }
    }

    console.log('❌ No matching payment found');
    return Response.json({
      success: false,
      message: 'No matching payment found',
      address: address,
      expectedAmount: amount,
      utxoCount: utxos.length,
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