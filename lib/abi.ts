// ABI from compiled Cairo contract (contracts/target/dev/event_manager_EventManager.contract_class.json)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EVENT_MANAGER_ABI: any[] = [
  {
    type: "impl",
    name: "EventManagerImpl",
    interface_name: "event_manager::IEventManager",
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      { name: "False", type: "()" },
      { name: "True", type: "()" },
    ],
  },
  {
    type: "struct",
    name: "event_manager::EventData",
    members: [
      { name: "event_name", type: "core::felt252" },
      { name: "organizer", type: "core::starknet::contract_address::ContractAddress" },
      { name: "age_requirement", type: "core::integer::u8" },
      { name: "max_attendees", type: "core::integer::u32" },
      { name: "ticket_count", type: "core::integer::u32" },
      { name: "active", type: "core::bool" },
    ],
  },
  {
    type: "interface",
    name: "event_manager::IEventManager",
    items: [
      {
        type: "function",
        name: "create_event",
        inputs: [
          { name: "event_name", type: "core::felt252" },
          { name: "age_requirement", type: "core::integer::u8" },
          { name: "max_attendees", type: "core::integer::u32" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_event",
        inputs: [{ name: "event_name", type: "core::felt252" }],
        outputs: [{ type: "event_manager::EventData" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_event_count",
        inputs: [],
        outputs: [{ type: "core::integer::u32" }],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "event",
    name: "event_manager::EventManager::EventCreated",
    kind: "struct",
    members: [
      { name: "event_name", type: "core::felt252", kind: "key" },
      { name: "organizer", type: "core::starknet::contract_address::ContractAddress", kind: "data" },
      { name: "max_attendees", type: "core::integer::u32", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "event_manager::EventManager::Event",
    kind: "enum",
    variants: [
      { name: "EventCreated", type: "event_manager::EventManager::EventCreated", kind: "nested" },
    ],
  },
]
