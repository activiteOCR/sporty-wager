export type IDLType = {
  version: "0.1.0";
  name: "shaker";
  instructions: [
    {
      name: "initializeExpense";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "expenseAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "id";
          type: "u64";
        },
        {
          name: "merchantName";
          type: "string";
        },
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "prediction";
          type: "string";
        }
      ];
    },
    {
      name: "modifyExpense";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "expenseAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "id";
          type: "u64";
        },
        {
          name: "merchantName";
          type: "string";
        },
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "prediction";
          type: "string";
        }
      ];
    },
    {
      name: "deleteExpense";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "expenseAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "id";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "expenseAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "merchantName";
            type: "string";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "prediction";
            type: "string";
          }
        ];
      };
    }
  ];
};

export const IDLData: IDLType = {
  version: "0.1.0",
  name: "shaker",
  instructions: [
    {
      name: "initializeExpense",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "expenseAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "id",
          type: "u64",
        },
        {
          name: "merchantName",
          type: "string",
        },
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "prediction",
          type: "string",
        },
      ],
    },
    {
      name: "modifyExpense",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "expenseAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "id",
          type: "u64",
        },
        {
          name: "merchantName",
          type: "string",
        },
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "prediction",
          type: "string",
        },
      ],
    },
    {
      name: "deleteExpense",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "expenseAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "id",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "expenseAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            type: "u64",
          },
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "merchantName",
            type: "string",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "prediction",
            type: "string",
          },
        ],
      },
    },
  ],
};
