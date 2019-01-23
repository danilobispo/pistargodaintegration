$("#personaButton").click(function() {

    // TODO: Remover botões que não fazem parte do CGM proposto para o Persona-based modelling
    // por exemplo: Role e Agent, Contribution Links, Resource, etc
    $('li[parent="#addActorDropdown"]:has(a[id="addRole"])').hide();
    $('li[parent="#addActorDropdown"]:has(a[id="addAgent"])').hide();
    // Role e Agent não fazem parte


});


