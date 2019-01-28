var Contexts = Backbone.Model.extend({
    defaults: {
        contextName: '',
        facts: '',
        stock: 0
    }
});

var Context = Backbone.Model.extend({
    defaults: {
        factTypes: FactType,
        personaTypes: PersonaType,
    }
});

var FactType = Backbone.Model.extend({
    defaults: {
        HasDiabetes: false,
        HasHBP: false,
        Cardiac: false,
        HasRheumatiod: false,
        ProneToFalling: false,
        HasOsteoporosis: false,
        DifficultyInWalking: false,
        HasAWheelChair: false,
        DontLikeTecnology: false,
        HasBadExperiencesWithTecnology: false,
        WantsToAvoidFrustatingExperiencesWithTecnologies: false,
        LivesWithHisOrHersChildrens: false,
        HasANurse: false,
        LivesInAnAsylum: false,
        HasAnAssistedLivingDevice: false,
        WalksOrRunsAsAPhysicalActivity: false,
        HasCellPhone: false,
        HasInternet: false,
        HasAmbulanceAccess: false
    }
});

var PersonaType = Backbone.Model.extend({
    defaults: {
        patient: true,
        doctor: false
    }
});