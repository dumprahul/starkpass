use starknet::ContractAddress;

#[derive(Drop, Copy, Serde, starknet::Store)]
pub struct EventData {
    pub event_name: felt252,
    pub organizer: ContractAddress,
    pub age_requirement: u8,
    pub max_attendees: u32,
    pub ticket_count: u32,
    pub active: bool,
}

#[starknet::interface]
pub trait IEventManager<TContractState> {
    fn create_event(
        ref self: TContractState,
        event_name: felt252,
        age_requirement: u8,
        max_attendees: u32,
    );
    fn get_event(self: @TContractState, event_name: felt252) -> EventData;
    fn get_event_count(self: @TContractState) -> u32;
}

#[starknet::contract]
mod EventManager {
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess};
    use super::{EventData, IEventManager};

    #[storage]
    struct Storage {
        events: Map<felt252, EventData>,
        event_exists: Map<felt252, bool>,
        event_count: u32,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        EventCreated: EventCreated,
    }

    #[derive(Drop, starknet::Event)]
    struct EventCreated {
        #[key]
        event_name: felt252,
        organizer: ContractAddress,
        max_attendees: u32,
    }

    #[abi(embed_v0)]
    impl EventManagerImpl of IEventManager<ContractState> {
        fn create_event(
            ref self: ContractState,
            event_name: felt252,
            age_requirement: u8,
            max_attendees: u32,
        ) {
            assert(event_name != 0, 'Event name cannot be empty');
            assert(max_attendees > 0, 'Max attendees must be > 0');
            assert(!self.event_exists.read(event_name), 'Event already exists');

            let organizer = get_caller_address();

            let event_data = EventData {
                event_name,
                organizer,
                age_requirement,
                max_attendees,
                ticket_count: 0,
                active: true,
            };

            self.events.write(event_name, event_data);
            self.event_exists.write(event_name, true);
            self.event_count.write(self.event_count.read() + 1);

            self.emit(EventCreated { event_name, organizer, max_attendees });
        }

        fn get_event(self: @ContractState, event_name: felt252) -> EventData {
            assert(self.event_exists.read(event_name), 'Event does not exist');
            self.events.read(event_name)
        }

        fn get_event_count(self: @ContractState) -> u32 {
            self.event_count.read()
        }
    }
}
