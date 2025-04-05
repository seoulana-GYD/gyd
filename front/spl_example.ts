/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/spl_example.json`.
 */
export type SplExample = {
  "address": "7nLFD23KKdVb82fJDJEDgQ1N6ZBy1AsW5e5R9Vizc6VF",
  "metadata": {
    "name": "splExample",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "grab",
      "discriminator": [
        166,
        108,
        246,
        251,
        19,
        39,
        76,
        111
      ],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "valutData"
        },
        {
          "name": "mint"
        },
        {
          "name": "newValut",
          "writable": true
        },
        {
          "name": "signerVault",
          "writable": true
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "valutData",
          "writable": true
        },
        {
          "name": "newMint",
          "writable": true
        },
        {
          "name": "newValut",
          "writable": true
        },
        {
          "name": "systemProgram"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram"
        }
      ],
      "args": [
        {
          "name": "uri",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "valutData",
      "discriminator": [
        96,
        148,
        204,
        249,
        21,
        179,
        13,
        221
      ]
    }
  ],
  "types": [
    {
      "name": "valutData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    }
  ]
};
