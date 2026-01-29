import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { address, expectedAmount, timestamp } = await req.json();

    if (!address || !expectedAmount || !timestamp) {
      return Response.json({ 
        error: 'Missing required parameters',
        verified: false 
      }, { status: 400 });
    }

    // Fetch recent transactions for the address from Kaspa API
    const kaspaApiUrl = `https://api.kaspa.org/addresses/${address}/full-transactions?limit=20&resolve_previous_outpoints=light`;
    
    const response = await fetch(kaspaApiUrl);
    
    if (!response.ok) {
      return Response.json({ 
        verified: false,
        error: 'Failed to fetch transactions from Kaspa network' 
      }, { status: 200 });
    }

    const data = await response.json();
    
    // Check if there are any transactions
    if (!data || !Array.isArray(data)) {
      return Response.json({ verified: false }, { status: 200 });
    }

    // Look for a transaction that matches the expected amount and is after the timestamp
    const targetAmountSompi = Math.round(expectedAmount * 100000000); // Convert KAS to sompi
    const timestampSeconds = Math.floor(timestamp / 1000);

    for (const tx of data) {
      // Check transaction timestamp (must be after verification started)
      const txTimestamp = tx.block_time ? Math.floor(tx.block_time / 1000) : 0;
      
      if (txTimestamp < timestampSeconds - 60) {
        // Skip transactions that are too old (before verification started - 60s buffer)
        continue;
      }

      // Check outputs for matching amount to our address
      if (tx.outputs && Array.isArray(tx.outputs)) {
        for (const output of tx.outputs) {
          if (output.script_public_key_address === address) {
            const receivedAmount = parseInt(output.amount);
            
            // Allow small tolerance (0.01 KAS = 1000000 sompi)
            const tolerance = 1000000;
            const amountMatch = Math.abs(receivedAmount - targetAmountSompi) <= tolerance;
            
            if (amountMatch) {
              return Response.json({
                verified: true,
                txid: tx.transaction_id,
                amount: receivedAmount / 100000000,
                timestamp: txTimestamp
              }, { status: 200 });
            }
          }
        }
      }
    }

    // No matching transaction found
    return Response.json({ verified: false }, { status: 200 });

  } catch (error) {
    console.error('Verification error:', error);
    return Response.json({ 
      verified: false,
      error: error.message 
    }, { status: 200 });
  }
});