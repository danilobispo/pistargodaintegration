import * as Backbone from "../istarcore/lib/backbone.min";

var Context = Backbone.Model.extend({
    initialize: function(){

    },
    defaults: {
        facts: Facts,
        personaType: PersonaType
    }
});

// List<FactTypes>
var Facts = Backbone.Collection.extend({
    model: Fact

});

//Fact Model
var Fact = Backbone.Model.extend({
    defaults: {
        factTypes: FactTypes,
        decompositionTypes: DecompositionTypes,
    }
});

var PersonaType = {
    PATIENT: 1,
    DOCTOR: 2
};

var DecompositionTypes = {
    AND: 1,
    OR: 2,
    LEAF: 3
};

var FactTypes = {
    HasDiabetes: 1,
    HasHBP: 2,
    Cardiac: 3,
    HasRheumatoid: 4,
    ProneToFalling: 5,
    HasOsteoporosis: 6,
    DifficultyInWalking: 7,
    HasAWheelChair: 8,
    DontLikeTechnology: 9,
    HasBadExperiencesWithTechnology: 10,
    WantsToAvoidFrustratingExperiencesWithTechnologies: 11,
    LivesWithHisOrHersChildren: 12,
    HasANurse: 13,
    LivesInAnAsylum: 14,
    HasAnAssistedLivingDevice: 15,
    WalksOrRunsAsAPhysicalActivity: 16,
    HasCellPhone: 17,
    HasInternet: 18,
    HasAmbulanceAccess: 19
};

var HealthRiskContext = new Facts({
});

var mary: Context = new Context