<?php

// Historical presentation samples only. These are not financial ledger records.
return [
    'period' => 'March–August 2026',
    'activity_trend' => [
        ['month' => 'Mar', 'requisitions' => 18, 'tenders' => 8],
        ['month' => 'Apr', 'requisitions' => 24, 'tenders' => 11],
        ['month' => 'May', 'requisitions' => 21, 'tenders' => 9],
        ['month' => 'Jun', 'requisitions' => 32, 'tenders' => 15],
        ['month' => 'Jul', 'requisitions' => 28, 'tenders' => 13],
        ['month' => 'Aug', 'requisitions' => 36, 'tenders' => 18],
    ],
    'spend_by_category' => [
        ['category' => 'Medical equipment', 'amount' => 12500000],
        ['category' => 'Pharmaceuticals', 'amount' => 8200000],
        ['category' => 'Medical consumables', 'amount' => 6400000],
        ['category' => 'Diagnostic reagents', 'amount' => 3800000],
        ['category' => 'Facility maintenance', 'amount' => 2100000],
    ],
    'alerts' => [
        ['id' => 'demo-payment', 'title' => 'Payment review', 'description' => 'BDT 480,000 for a sample medical oxygen delivery awaits finance review.', 'kind' => 'payment', 'source' => 'demo'],
        ['id' => 'demo-contract', 'title' => 'Contract renewal', 'description' => 'Sample biomedical equipment maintenance agreement is due for renewal within 30 days.', 'kind' => 'contract', 'source' => 'demo'],
    ],
];
