# 06.04. Backpressure, processing capacity, and pattern selection

By backpressure we mean that a slower consumer or processor affects production, delivery or acceptance. If a system takes on infinitely more work than it can do, it just pushes the load to memory or a persistent queue.

## Simple capacity model

Denote `λ` the arrival rate and `μ` the total processing rate. If it is permanently `λ > μ`, the pending work increases. For a short time, the buffer can be useful, but for sustainable operation, the overall processing capacity and the load pattern must match.

If 600 exports arrive per minute and one worker handles 120, the theoretical capacity of five workers is just enough. In reality, due to variable task lengths, dependency limits and failures, a reserve is also necessary. Multiple workers do not speed things up if they are all waiting on the same limited external API.

## Limitations at the consumer

Prefetch or in-flight limit can control how much unacknowledged work a consumer receives at once. This limits memory use and can help with even distribution. Due to too large a prefetch, a worker can reserve many tasks while others are empty.

We choose parallelism for business and technical constraints. If the events of an order are to be applied sequentially, we do not start unlimited parallel processing for the same key. This allows other keys to progress at the same time.

## Restrictions at the entry point

The system may refuse or delay new work if there is no available capacity. The consumer needs a clear answer: we accepted it and queued it, try again later, or the operation cannot be started. The status and expiration date of the durably accepted job must be shown.

Certain data may be aggregated. When displaying a current temperature, the most recent value may be enough, in the case of a bank transaction, we cannot discard an intermediate record. A “drop old messages” rule must follow from the meaning of the data.

## Synchronous and asynchronous selection

An immediate decision, such as an authorization check or reservation result, often needs a direct response. Long-running processing and multiple independent reactions may benefit from asynchronous communication. Not every service call needs to become an event.

The price of asynchronous operation is pending state, late result, retry, and multi-place tracking. The client also needs to know that the work is still being done. A background error hidden from the user is not reliable operation.

> [!tip] Next to the queue length, measure age and result
> In addition to the number of pending messages, monitor the age of the oldest job, the processing time, the retry rate and the final error. The same queue length means different things for jobs of different lengths.

## Analysis exercise

An e-mail worker can send 10,000 emails per hour, but the system receives 20,000 jobs in half an hour. Calculate the theoretical emptying time without new work. Then design the priority, expiration, and user-visible status. Check what increasing the number of worker instances would do with an unchanged service provider limit.
