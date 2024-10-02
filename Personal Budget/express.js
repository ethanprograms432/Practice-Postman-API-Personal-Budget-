const express = require('express');
const app = express();
const bodyparser = require('body-parser')

let totalBudget = 0
let envelopes = []

const PORT = process.env.PORT || 3000

app.use(bodyparser.json())


app.get('/envelopes/',(req,res,next) => {

    res.send(envelopes)

})


app.get('/envelopes/:envelopeName',(req,res,next) => {

    const envelopeName = req.params.envelopeName
    const envelope = envelopes.find(env => env["name"] === envelopeName)

    if(envelope) {

        res.send(envelope)
    } else {

        res.status(404).send('Envelope not found!')
    }
    

})

app.post('/envelopes/',(req,res,next) => {

    const envelope = req.body

    if(envelope) {

        envelopes.push(envelope)
        totalBudget += envelope["price"]
        res.status(201).send(envelope)

    } else {

        res.status(400).send('Invalid request!')
    }
  

})

app.post('/envelopes/:envelopeOneName/:envelopeTwoName',(req,res,next) => {

    const envelopeOneName = req.params.envelopeOneName
    const envelopeTwoName = req.params.envelopeTwoName

    const envelopeOneIndex = envelopes.findIndex(env => env["name"] === envelopeOneName)
    const envelopeTwoIndex = envelopes.findIndex(env => env["name"] === envelopeTwoName)

    const transfer = req.body
    const transferValue = transfer["transferValue"]

    if(envelopeOneIndex !== -1 && envelopeTwoIndex !== -1) {

        envelopes[envelopeOneIndex]["price"] -= transferValue
        envelopes[envelopeTwoIndex]["price"] += transferValue
        res.status(201).send('Transfer successful!')

    } else {

        res.status(404).send('Envelope(s) not found!')
    }

})

app.put('/envelopes/:envelopeName/',(req,res,next) => {

    const envelopeName = req.params.envelopeName
    const envelopeIndex = envelopes.findIndex(env => env["name"] === envelopeName)

    const newEnvelope = req.body

    if(envelopeIndex !== -1) {

        let budgetDifference = newEnvelope["price"] - envelopes[envelopeIndex]["price"]
        totalBudget += budgetDifference
        const envelope = envelopes[envelopeIndex]
        envelopes[envelopeIndex] = newEnvelope
        res.status(200).send(envelopes[envelopeIndex])

    } else {

        res.status(404).send('Envelope not found!')
    }

})

app.delete('/envelopes/:envelopeName', (req,res,next) => {

    const envelopeName = req.params.envelopeName
    const envelopeIndex = envelopes.findIndex(env => env["name"] === envelopeName)

    if(envelopeIndex !== -1) {

        totalBudget -= envelopes[envelopeIndex]["price"]
        envelopes.splice(envelopeIndex,1)
        res.status(204).send(`Envelope ${envelopeName} was successfully deleted`)

    } else {

        res.status(404).send('Envelope not found!')
    }

})

app.listen(PORT, () => {

    console.log('Listening on port ' + PORT)
})



