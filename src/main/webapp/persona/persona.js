/**
 * Responsável por remover botões que não fazem parte do CGM proposto para o Persona-based modelling
 */
function alterarControlesDaUI(){
    // TODO: Remover botões que não fazem parte do CGM proposto para o Persona-based modelling
    // por exemplo: Role e Agent, Contribution Links, Resource, etc

    // Role e Agent não fazem parte
    $('li[parent="#addActorDropdown"]:has(a[id="addRole"])').hide();
    $('li[parent="#addActorDropdown"]:has(a[id="addAgent"])').hide();

};

/**
 * Responsável por restaurar os controles da UI quando o Persona-based modelling não estiver ativo
 */
function restaurarControlesDaUI() {
    $('li[parent="#addActorDropdown"]:has(a[id="addRole"])').show();
    $('li[parent="#addActorDropdown"]:has(a[id="addAgent"])').show();
};

/**
 * Limpa o diagrama atual, garantindo que o usuário não utilize um diagrama PiStar que pode conter
 * elementos não previstos no modelo CGM de Persona-Based Modelling
 */
function removerDiagramaAtual() {
    istar.clearModel();
}



