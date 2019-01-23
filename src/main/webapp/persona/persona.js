$("#personaButton").click(function() {

    // TODO: Remover botões que não fazem parte do CGM proposto para o Persona-based modelling
    // por exemplo: Role e Agent, Contribution Links, Resource, etc
    $('li:has(a[id="addRole"])').remove();
    $('li:has(a[id="addAgent"])').remove();
    // Role e Agent não fazem parte


});


