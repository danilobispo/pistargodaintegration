package br.unb.cic.persona;

import br.unb.cic.goda.model.Goal;
import br.unb.cic.goda.model.Plan;

import java.util.List;
import java.util.Set;

public class PersonaAchievability {
    protected Goal rootGoal;
    protected String failedNodeName;
    protected List<String> personaContexts;
    protected List<String> cgmContexts;

    public Goal getRootGoal() {
        return rootGoal;
    }

    public void setRootGoal(Goal rootGoal) {
        this.rootGoal = rootGoal;
    }

    public String getFailedNodeName() {
        return failedNodeName;
    }

    public void setFailedNodeName(String failedNodeName) {
        this.failedNodeName = failedNodeName;
    }

    public List<String> getPersonaContexts() {
        return personaContexts;
    }

    public void setPersonaContexts(List<String> personaContexts) {
        this.personaContexts = personaContexts;
    }

    public List<String> getCgmContexts() {
        return cgmContexts;
    }

    public void setCgmContexts(List<String> cgmContexts) {
        this.cgmContexts = cgmContexts;
    }

    public PersonaAchievability(Set<Goal> selectedGoals) {
        TreeBooleanEvaluator evaluator = new TreeBooleanEvaluator();
        selectedGoals.forEach(goal -> {
            if (goal.isRootGoal()) {
                this.rootGoal = goal;
            }
        });
        System.out.println(this.rootGoal);
    }

    public void run() {
        // Caso assertion condition na raiz:
        if (this.rootGoal.getCreationProperty() != null) { // significa que tem assertionCondition
            if ( !evaluateGoalExpression(this.rootGoal) ) {
                System.out.println("The current persona does not meet the CGM context conditions");
            } else {
                if(iterateThroughGoalsAndPlans(this.rootGoal)){
                    System.out.println("The current persona meets the CGM context conditions!");
                } else {
                    System.out.println("The current persona does not meet the CGM context conditions");
                }
            }
        }


    }

    private boolean iterateThroughGoalsAndPlans(Goal targetGoal) {
        String failedNodeName;
        boolean isAnd = targetGoal.isAndDecomposition();
        boolean flagFailure = false;
        int flagCount = 0;
        int targetGoalSizeDecompListSize = targetGoal.getDecompositionList().size();
        int meansToAndEndPlansSize = targetGoal.getMeansToAnEndPlans().size();
        if (targetGoalSizeDecompListSize > 0) {
            // Se for and, todas as assertivas daqui pra baixo tem que dar true

            for (Goal childGoal : targetGoal.getDecompositionList()) {
                if (childGoal.getCreationProperty() != null) { // significa que tem assertionCondition
                    if (!this.evaluateGoalExpression(childGoal) && isAnd) { // não passou na evaluation, deu false
                        flagFailure = true;
                        this.failedNodeName = childGoal.getName();
                        this.informFailure(this.failedNodeName);
                        this.informTotalFailure(this.failedNodeName);
                    } else if (!this.evaluateGoalExpression(childGoal) && !isAnd){// caso que não passou mas é OR
                        this.failedNodeName = childGoal.getName();
                        informFailure(this.failedNodeName);
                        flagFailure = true;
                        flagCount++;
                    }
                }
                if(flagCount == targetGoalSizeDecompListSize) { // Falhou em todos os Or's de um filho, falhou total
                    informTotalFailure(this.failedNodeName);
                }
                iterateThroughGoalsAndPlans(childGoal);
            }
        } else if (meansToAndEndPlansSize > 0) {
            for (Plan childPlan : targetGoal.getMeansToAnEndPlans()) {
                if (childPlan.getCreationProperty() != null) { // significa que tem assertionCondition
                    if (!this.evaluateTaskExpression(childPlan) && isAnd) { // não passou na evaluation, deu false
                        flagFailure = true;
                        this.failedNodeName = childPlan.getName();
                        this.informFailure(this.failedNodeName);
                        this.informTotalFailure(this.failedNodeName);
                    } else if (!this.evaluateTaskExpression(childPlan) && !isAnd){// caso que não passou mas é OR
                        this.failedNodeName = childPlan.getName();
                        informFailure(this.failedNodeName);
                        flagFailure = true;
                        flagCount++;
                    }
                }
                if(flagCount == targetGoalSizeDecompListSize) { // Falhou em todos os Or's de um filho, falhou total
                    informTotalFailure(this.failedNodeName);
                }
            }
        }

        return !flagFailure;
    }


    public void iterateThroughEndPlans(Plan targetPlan) {


    }

    public boolean evaluateGoalExpression(Goal goal) {
        String goalContextCondition = goal.getCreationProperty();
        // Retira assertion condition da string
        goalContextCondition = goalContextCondition.substring(20);
        TreeBooleanEvaluator evaluator = new TreeBooleanEvaluator();
        return evaluator.doIt(evaluator, goalContextCondition);
    }

    public boolean evaluateTaskExpression(Plan task) {
        String taskContextCondition = task.getCreationProperty();
        // Retira assertion condition da string
        taskContextCondition = taskContextCondition.substring(20);
        TreeBooleanEvaluator evaluator = new TreeBooleanEvaluator();
        return evaluator.doIt(evaluator, taskContextCondition);
    }

    public void informFailure(String failedNodeName) {
        System.out.println("Error at" + failedNodeName + ".Logical proposition is false");
    };

    public void informTotalFailure(String failedNodeName) {
        System.out.println("Error at" + failedNodeName + ".Conditions not met for persona");
    };
}
