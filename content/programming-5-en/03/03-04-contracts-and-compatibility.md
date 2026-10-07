# 03.04. Communication contracts and version coexistence

The communication contract is more than a list of JSON fields. It specifies the meaning of the operation, limits on input, output, errors, and allowable retries. To independently release services, old and new consumers must work together for a period of time.

## Layers of contract

The syntactic contract describes the format: field types, required fields, encoding, date and number format. The semantic contract tells you what they mean. `price: 1200` can mean forints, pennies or an internal unit without a currency; the interpretation does not follow from the type.

The behavioral contract defines side effects. Does a `reserve` operation just check the inventory or reserve it? How long is the reservation valid for? What happens with duplicate ID? A time budget, maximum message size and load limit may be linked to the operational contract.

## Compatible and breaking changes

A new optional field is usually easier to introduce than renaming an old mandatory field. But compatibility also depends on the behavior of the consumer: a strict decoder can also reject an unknown field. A new enum value can also cause problems if the client considers all possible values ​​closed.

Semantic change is particularly dangerous. If `total` previously represented a gross amount and later a net amount, the schema may remain unchanged, but the cooperation is still broken. The contract review must therefore also examine the behavior.

## Expand–migrate–contract

When making incremental changes, we first expand the contract so that the old consumer works. We then transition the consumers and measure the usage of the old field or action. Finally, we remove the part that is no longer used. The three stages are not a single joint release moment.

For a renamed field, for example, both fields may be temporarily present. It must be specified which is the governing one and what happens in the case of conflicting values. The appearance of the new field does not immediately justify the removal of the old one, as long as old clients are running.

## Contract checks

The provider can verify that its response conforms to the published schema and examples. The consumer can also set his own expectations: which operation to use, which fields to rely on, which errors to handle. The consumer-driven contract test makes actual consumer needs visible.

This is not a substitute for integration testing. A valid response according to a schema may be an incorrect business result, and the compatible API may be unreachable due to bad routing. We select the level of examination for the question.

> [!warning] The version number is not proof of compatibility
> The `/v2` path or new topic name only separates the versions. Migration, parallel operation and the retirement of old clients must still be planned.

## Contract design exercise

Write a short contract for a `CreateExport` operation. It should include input format, time zone, operation ID, acceptance response, status query, errors and retry handling. Then plan to introduce a new export format so that the old clients continue to work.
