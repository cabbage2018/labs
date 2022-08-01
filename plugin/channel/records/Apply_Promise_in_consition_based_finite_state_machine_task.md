# Purpose 

I need run an timer related task with such feature:
-execute every 30 seconds for N times
-when the whole task finished with fulfill the loop count minus 1, N - 1
-if the whole task end with rejection any how the loop count remains and the further task halted, that is no new task will be scheduled, this round is terminated 
-as small as possible that is no scaffold and framework except promise will be used 

# Design

I would like use Promise module to implement this job. 

First, a timer aligned task looks like this

``` Javascript

var t1 = setTimeout(
    () => {scanJob(configuration)},
    30 * 1000
)

```

This way perfectly solved the "threaded" requirement, this means even the "scanJob()" failed somehow my program still work for other task. since setTimeout() 's way serves perfectly as a multi-thread mimic in JavaScript.

we need further more features. 

``` JavaScript

function runNtimes(remains){

    async () => {

		do {
			 await sleep(30*1000)
            .then(()=>{
                scanJob(configuration);
                console.log("then: `${new Date()}`" + new Date())
            })
			.catch(()=>{
                console.log("catch: `${new Date()}`" + new Date())
            })
			
            console.log("remains, `${new Date()}`" + new Date() + remains)
            
			remains --
		} while (remains > 0);
	
    };    
}

runNtimes(10);

```

this version goes some further, it utilized the setTimeout() function (in sleep); it utilized the await to synchronize a timer; it utilized then and catch to harness the promised task; it implemented a definite cycles of our scan job task.

but it did not implement the stop when crash - it means this version did not utilize the then and catch more powerfully.


``` JavaScript

function scan(promiseObject1){
    
    promiseObject1.run()
    .then(()=>{
        if(promiseObject1.context.remains > 0 && promiseObject1.context.residual <=0){
            return new Promise(function(resolve, reject) {
                setTimeout(resolve, ms);    /// next round 
            })
        }
    })
    .catch(()=>{

        return null;    /// fine, then we end up here

    })
}

function scanJob(context){
    
    //...
    c = context

    if(c.remains > 0/*&& c.residual <=0*/){
        scan(c)
        .then(()=>{
                
                var t1 = new Promise(function(resolve, reject) {
                    setTimeout(scan, 30000);
                })
                t1.context.remains = c.remains - 1
                return t1

        })
        .catch(()=>{
            return null
        })
    }else{
        return null
    }

}

function runNtimes(p1){

    var q1 = null

		do {
            q1 = await p1.execute()
            .then(()=>{

                var r1 = await scanJob(p1.context);
                return r1            
            })
			.catch(()=>{
                console.log("catch: `${new Date()}`" + new Date())
                return null;
            })
			
            console.log("remains, `${new Date()}`" + new Date() + remains)
            p1 = q1

		} while(q1 !== null);

}

```

if you want to catch the resulting exception you must run and wait until the task ends up successlly or timeout or exception immediately. those 3 imaged states are of great value. And the logic goes rather complex now. I try to explain it, at first you initialize a new promise() which call a scan immediately(if the conditions meets the hard job run), according to the result, fulfill path return a new promise() which scheduled in 30 seconds and the target timer expires repeat the same thing(read context, check conditions, job() if necessary, return), the new promise's context has to be modified as the last round have been conducted successfully. that is round minus 1 and calculate the residual seconds if the
    remains --
    residual -= 30*1000ms

