import * as Backbone from "../istarcore/lib/backbone.min";

var personaUi = {};

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
    initialize: function(models, options){

    },
    defaults: {
        model: Fact
    }
});

//Fact Model
var Fact = Backbone.Model.extend({
    defaults: {
        viewName: "",
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

/*Facts = new List<Fact>() {
    new Fact(FactTypes.HasDiabetes , DecompositionTypes.OR),
        new Fact(FactTypes.HasHBP , DecompositionTypes.OR),
        new Fact(FactTypes.Cardiac , DecompositionTypes.OR),
        new Fact(FactTypes.HasRheumatiod , DecompositionTypes.OR),
        new Fact(FactTypes.ProneToFalling , DecompositionTypes.OR),
        new Fact(FactTypes.HasOsteoporosis , DecompositionTypes.OR),*/

var HealthRiskContext = new Facts([
    new Fact({viewName: FactTypes.HasDiabetes.toString(), factTypes: FactTypes.HasDiabetes, decompositionTypes: DecompositionTypes.OR }),
    new Fact({viewName: FactTypes.HasHBP.toString(), factTypes: FactTypes.HasHBP, decompositionTypes: DecompositionTypes.OR }),
    new Fact({viewName: FactTypes.Cardiac.toString(), factTypes: FactTypes.Cardiac, decompositionTypes: DecompositionTypes.OR }),
    new Fact({viewName: FactTypes.HasRheumatoid.toString(), factTypes: FactTypes.HasRheumatoid, decompositionTypes: DecompositionTypes.OR }),
    new Fact({viewName: FactTypes.ProneToFalling.toString(), factTypes: FactTypes.ProneToFalling, decompositionTypes: DecompositionTypes.OR }),
    new Fact({viewName: FactTypes.HasOsteoporosis.toString(), factTypes: FactTypes.HasOsteoporosis, decompositionTypes: DecompositionTypes.OR }),
]);



