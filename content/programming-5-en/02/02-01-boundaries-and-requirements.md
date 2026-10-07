# 02.01. From requirements to service boundaries

System design does not begin by dividing endpoints and database tables among services. We identify which business responsibility enforces each rule, which data it controls, and which other responsibilities it collaborates with. The result may be a modular monolith or several services; both require logical boundaries.

## Planning in verifiable steps

First, let's name the actors of the system and the actions they initiate. Then we write down the rules to be preserved: for example, a seat cannot be sold twice, or an accounting item cannot disappear afterwards. From the rule, it can be determined which component must handle the decision and the modification together.

Functional requirements are accompanied by quality requirements. A different decomposition may be justified if search handles unusually heavy traffic, billing requires regulatory separation, or two teams follow different release schedules. A service boundary is both a business and an operational decision.

## Cohesion and coupling

**Cohesion** describes how closely a unit’s responsibilities belong together. Reserving and releasing a seat and checking reservation state share common rules. It is a good sign when they change together and one data owner can manage them.

**Coupling** describes the dependency between units. Calling one stable business operation creates less coupling than knowing another service’s internal tables and state. The goal is high internal cohesion and manageable external coupling; complete independence is unrealistic.

A bounded context is the validity boundary of a model. "Product" can mean a description and image in the catalog, stock ID and movements in the warehouse, and tax data in invoicing. There is no need to impose one giant common object on all contexts. A context is not necessarily a single microservice, but it is a useful starting point for boundary tracing.

## Data owner and operation owner

Assign an owner to all modifiable business data. The consumer can ask questions or keep a copy, but the rules of the original state are enforced by the owner. If multiple services independently write the same table, responsibility becomes blurred and schema changes may require a joint release.

The operation owner is responsible for the status of the process. An order can affect several services, but you need to know who keeps track of the progress of the fulfillment. The wording "everyone sends an event" is not an answer in itself as to where the end result of the process can be seen.

> [!important] Do not produce services from entity names
> The names `UserService`, `AddressService` and `EmailService` do not prove good decomposition. The boundary is justified by responsibilities, rules, and patterns of change.

## Checking boundaries

Write down all the necessary data and calls for a selected operation. If two services communicate back and forth many times in each request, let's check whether the services are too finely divided. If almost every change affects three services, the boundary does not follow the nature of the changes.

Too large a service combines multiple responsibilities with different lifecycles. Too small creates too many network dependencies. Rather than size alone, use shared change patterns, data ownership, and transaction requirements as practical criteria.

## Design exercise

Separate the event catalog, seat reservation and payment in a ticketing system. Add responsibility, data owner and public operation to each unit. Then check which unit can consistently enforce the reservation and final sale rules.
