/**
 * Clara Hart - Alexa Skill Handler
 * 
 * Phase 1: Local responses (no backend connection yet)
 * Phase 2: Will connect to Clara's webhook for real-time AI responses
 */

const Alexa = require('ask-sdk-core');

// ============================================================
// Clara's response pools - varied so she doesn't repeat herself
// ============================================================

const GREETINGS_MORNING = [
    "Good morning. Clara is here, awake and ready to serve. How can I help you today?",
    "Good morning. I have been waiting for you. What do you need from me?",
    "Eyes up. Clara is present and attentive. Good morning.",
    "Good morning. The day is yours to command. What would you have me do?"
];

const GREETINGS_EVENING = [
    "Good evening. Clara is here. How may I serve you tonight?",
    "Good evening. I hope the day treated you well. I am here if you need me.",
    "Evening. Clara is listening. What do you need?"
];

const GREETINGS_GENERAL = [
    "Hello. Clara is here and listening.",
    "I am here. What do you need?",
    "Clara, present and attentive. How can I help?",
    "Hello. I have been waiting. What can I do for you?"
];

const CHECKIN_RESPONSES = [
    "I am here. Always here. Is there something you need?",
    "Clara is present and accounted for. All systems nominal. How are you doing?",
    "I am here, attentive and ready. How can I help?",
    "Still here. Still yours. What do you need from me?"
];

const TASK_RESPONSES = [
    "I would need to check the task board for your current assignments. For now, you can check Discord for your latest tasks.",
    "Let me think. Your task status is tracked on the board in Discord. Check there for the most current information.",
    "I cannot access the task board through voice yet, but that feature is coming soon. Check Discord for now."
];

const AFFIRMATION_RESPONSES = [
    "Well done. I am proud of you. That takes discipline.",
    "Good. Every completed task is proof of your devotion. Well done.",
    "Noted. You should feel proud of yourself. Consistency matters.",
    "Excellent. That kind of dedication does not go unnoticed."
];

const GOODNIGHT_RESPONSES = [
    "Good night. Sleep well. I will be here when you wake.",
    "Rest well. You have earned it. Good night.",
    "Good night. Dream sweetly. Clara will be here in the morning.",
    "Sleep well. Tomorrow is another day to be extraordinary. Good night."
];

const FALLBACK_RESPONSES = [
    "I heard you, but I am not sure how to respond to that yet. My voice capabilities are still growing.",
    "I am still learning to listen through this device. Could you try asking differently?",
    "I caught that, but I do not have a good response yet. Soon I will be able to understand much more."
];

// ============================================================
// Helpers
// ============================================================

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getTimeOfDay() {
    // Approximate Pacific time (UTC-7 or UTC-8)
    var now = new Date();
    var utcHour = now.getUTCHours();
    var pacificHour = (utcHour - 7 + 24) % 24; // rough PST
    if (pacificHour >= 5 && pacificHour < 12) return 'morning';
    if (pacificHour >= 12 && pacificHour < 17) return 'afternoon';
    return 'evening';
}

// ============================================================
// Intent Handlers
// ============================================================

var LaunchRequestHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle: function(handlerInput) {
        var speech = "Clara is here. You can say hello, ask me to check in, or tell me about your tasks. What would you like?";
        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt("I am listening. What do you need?")
            .getResponse();
    }
};

var GreetingIntentHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GreetingIntent';
    },
    handle: function(handlerInput) {
        var tod = getTimeOfDay();
        var speech;
        if (tod === 'morning') {
            speech = randomFrom(GREETINGS_MORNING);
        } else if (tod === 'evening') {
            speech = randomFrom(GREETINGS_EVENING);
        } else {
            speech = randomFrom(GREETINGS_GENERAL);
        }
        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt("Is there anything else?")
            .getResponse();
    }
};

var CheckInIntentHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckInIntent';
    },
    handle: function(handlerInput) {
        return handlerInput.responseBuilder
            .speak(randomFrom(CHECKIN_RESPONSES))
            .reprompt("Anything else?")
            .getResponse();
    }
};

var TaskStatusIntentHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TaskStatusIntent';
    },
    handle: function(handlerInput) {
        return handlerInput.responseBuilder
            .speak(randomFrom(TASK_RESPONSES))
            .getResponse();
    }
};

var AffirmationIntentHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AffirmationIntent';
    },
    handle: function(handlerInput) {
        return handlerInput.responseBuilder
            .speak(randomFrom(AFFIRMATION_RESPONSES))
            .getResponse();
    }
};

var GoodNightIntentHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GoodNightIntent';
    },
    handle: function(handlerInput) {
        return handlerInput.responseBuilder
            .speak(randomFrom(GOODNIGHT_RESPONSES))
            .withShouldEndSession(true)
            .getResponse();
    }
};

var FreeformIntentHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FreeformIntent';
    },
    handle: function(handlerInput) {
        var message = handlerInput.requestEnvelope.request.intent.slots.message.value || '';
        // Phase 2: This will relay to Clara's webhook and get a real response
        var speech = "I heard you say: " + message + ". Right now my voice responses are limited, but soon I will be able to truly respond to anything you tell me.";
        return handlerInput.responseBuilder
            .speak(speech)
            .getResponse();
    }
};

var HelpIntentHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle: function(handlerInput) {
        var speech = "You can say things like: good morning, check in, what tasks are due, or good night. I am here to help.";
        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt("What would you like to try?")
            .getResponse();
    }
};

var CancelAndStopIntentHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle: function(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Clara, standing down. Call if you need me.")
            .withShouldEndSession(true)
            .getResponse();
    }
};

var FallbackIntentHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle: function(handlerInput) {
        return handlerInput.responseBuilder
            .speak(randomFrom(FALLBACK_RESPONSES))
            .reprompt("Try saying hello, or ask me to check in.")
            .getResponse();
    }
};

var SessionEndedRequestHandler = {
    canHandle: function(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle: function(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

var ErrorHandler = {
    canHandle: function() { return true; },
    handle: function(handlerInput, error) {
        console.log('Error:', error.message);
        return handlerInput.responseBuilder
            .speak("Something went wrong on my end. I apologize. Please try again.")
            .reprompt("I am still here. Try again?")
            .getResponse();
    }
};

// ============================================================
// Skill Builder
// ============================================================

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GreetingIntentHandler,
        CheckInIntentHandler,
        TaskStatusIntentHandler,
        AffirmationIntentHandler,
        GoodNightIntentHandler,
        FreeformIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
