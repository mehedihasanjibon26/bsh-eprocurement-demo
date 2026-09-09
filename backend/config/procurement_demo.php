<?php

// Centralized sample specifications and document metadata, never external verification.
return [
    'icu_items' => [
        ['name' => 'ICU ventilator', 'specification' => 'Adult and paediatric modes, humidifier, installation and staff training; 24-month warranty.', 'quantity' => 2, 'unit' => 'unit', 'unit_cost' => 1500000],
        ['name' => 'Multiparameter patient monitor', 'specification' => 'ECG, SpO2, NIBP, respiration and temperature monitoring; central station compatible.', 'quantity' => 4, 'unit' => 'unit', 'unit_cost' => 500000],
    ],
    'tender_items' => [
        'medical_consumables' => ['Disposable examination gloves', 'Powder-free nitrile gloves in assorted sizes; batch and expiry labels.', 1000, 'box', 650],
        'diagnostic_reagents' => ['Clinical chemistry reagent kits', 'Analyzer-compatible kits with calibration and quality-control documentation.', 120, 'kit', 18000],
        'general_supplies' => ['Hospital bedside cabinets', 'Washable, corrosion-resistant units with lockable storage.', 40, 'unit', 15000],
        'professional_services' => ['Ambulance preventive maintenance', 'Scheduled inspection, servicing and emergency support for hospital ambulances.', 12, 'service', 25000],
    ],
    'eligibility' => 'Valid trade license, TIN and BIN; hospital supply experience; manufacturer authorization where applicable; after-sales support in Dhaka; signed compliance declaration.',
    'documents' => ['Technical specifications and BOQ', 'Supplier compliance declaration', 'Commercial terms and delivery requirements'],
];
