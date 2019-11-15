package br.unb.cic.persona;

import br.unb.cic.goda.model.Goal;
import br.unb.cic.goda.model.Persona;
import br.unb.cic.goda.model.Plan;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class PersonaAchievability {
    protected Goal rootGoal;
    protected String failedNodeName;
    protected List<String> personaContexts;

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

    public PersonaAchievability(Set<Goal> selectedGoals, ArrayList<String> personaContexts) {
        this.personaContexts = personaContexts;
        selectedGoals.forEach(goal -> {
            if (goal.isRootGoal()) {
                this.rootGoal = goal;
            }
        });
        System.out.println(this.rootGoal);
    }

    public boolean run() {
        // Caso assertion condition na raiz:
        System.out.println("Goal " + this.rootGoal.getName() + " is being evaluated");
        if (this.rootGoal.getCreationProperty() != null) { // significa que tem assertionCondition
            if (!evaluateGoalExpression(this.rootGoal)) {
                System.out.println("The current persona does not meet the CGM context conditions");
                return false;
            }
        } else {
            if (!iterateThroughGoalsAndPlans(this.rootGoal)) {
                System.out.println("The current persona meets the CGM context conditions!");
                return true;
            } else {
                System.out.println("The current persona does not meet the CGM context conditions");
                return false;
            }
        }
        return true;
    }

    private boolean iterateThroughGoalsAndPlans(Goal targetGoal) {
        String failedNodeName;
        boolean isAnd = targetGoal.isAndDecomposition();
        boolean flagFailure = false;
        int flagCount = 0;
        int targetGoalSizeDecompListSize = targetGoal.getDecompositionList().size();
        int targetGoalMeansToAndEndPlansSize = targetGoal.getMeansToAnEndPlans().size();
        if (targetGoalSizeDecompListSize > 0) {
            // Se for and, todas as assertivas daqui pra baixo tem que dar true

            for (Goal childGoal : targetGoal.getDecompositionList()) {
                if (!flagFailure) {
                    System.out.println("Goal " + childGoal.getName() + " is being evaluated");
//                boolean evaluationResult = this.evaluateGoalExpression(childGoal);
                    if (childGoal.getCreationProperty() != null) { // significa que tem assertionCondition
                        boolean evaluationExpressionResult = this.evaluateGoalExpression(childGoal);
                        if (!evaluationExpressionResult && isAnd) { // não passou na evaluation, deu false
                            flagFailure = true;
                            this.failedNodeName = childGoal.getName();
                            this.informFailure(this.failedNodeName);
                            this.informTotalFailure(this.failedNodeName);
                        } else if (!evaluationExpressionResult && !isAnd) {// caso que não passou mas é OR
                            this.failedNodeName = childGoal.getName();
                            informFailure(this.failedNodeName);
                            flagCount++;
                        }
                    }
                    if (flagCount == targetGoalSizeDecompListSize) { // Falhou em todos os Or's de um filho, falhou total
                        flagFailure = true;
                        informTotalFailure(this.failedNodeName);
                    }
                    if (!flagFailure) {
                        flagFailure = iterateThroughGoalsAndPlans(childGoal);
                    }
                }
            }
        } else if (targetGoalMeansToAndEndPlansSize > 0) {
            for (Plan childPlan : targetGoal.getMeansToAnEndPlans()) {
                if (!flagFailure) {
                    System.out.println("Task " + childPlan.getName() + " is being evaluated");
                    if (childPlan.getCreationProperty() != null) { // significa que tem assertionCondition
                        boolean evaluationExpression = this.evaluateTaskExpression(childPlan);
                        if (!evaluationExpression && isAnd) { // não passou na evaluation, deu false
                            flagFailure = true;
                            this.failedNodeName = childPlan.getName();
                            this.informFailure(this.failedNodeName);
                            this.informTotalFailure(this.failedNodeName);
                        } else if (!evaluationExpression && !isAnd) {// caso que não passou mas é OR
                            this.failedNodeName = childPlan.getName();
                            informFailure(this.failedNodeName);
                            flagCount++;
                        }
                    }
                    if (flagCount == targetGoalMeansToAndEndPlansSize) { // Falhou em todos os Or's de um filho, falhou total
                        flagFailure = true;
                        informTotalFailure(this.failedNodeName);
                    }
                    flagFailure = iterateThroughEndPlans(childPlan);
                }
            }
        }
        return flagFailure;
    }


    public boolean iterateThroughEndPlans(Plan targetPlan) {
        String failedNodeName;
        boolean isAnd = targetPlan.isAndDecomposition();
        boolean flagFailure = false;
        int flagCount = 0;
        int targetPlanEndPlansSize = targetPlan.getEndPlans().size();
        if (targetPlanEndPlansSize > 0) {
            for (Plan childPlan : targetPlan.getEndPlans()) {
                if (!flagFailure) {
                    System.out.println("Task " + childPlan.getName() + " is being evaluated");
                    if (childPlan.getCreationProperty() != null) { // significa que tem assertionCondition
                        boolean evaluationExpression = this.evaluateTaskExpression(childPlan);
                        if (!evaluationExpression && isAnd) { // não passou na evaluation, deu false
                            flagFailure = true;
                            this.failedNodeName = childPlan.getName();
                            this.informFailure(this.failedNodeName);
                            this.informTotalFailure(this.failedNodeName);
                        } else if (!evaluationExpression && !isAnd) {// caso que não passou mas é OR
                            this.failedNodeName = childPlan.getName();
                            informFailure(this.failedNodeName);
                            flagFailure = true;
                            flagCount++;
                        }
                    }
                    if (flagCount == targetPlanEndPlansSize) { // Falhou em todos os Or's de um filho, falhou total
                        flagFailure = true;
                        informTotalFailure(this.failedNodeName);
                    }
                    if (!flagFailure) {
                        flagFailure = iterateThroughEndPlans(childPlan);
                    }
                }
            }
        }
        return flagFailure;
    }

    public boolean evaluateGoalExpression(Goal goal) {
        String goalContextCondition = goal.getCreationProperty();
        // Retira assertion condition da string
        goalContextCondition = goalContextCondition.substring(20);
        TreeBooleanEvaluator evaluator = new TreeBooleanEvaluator(this.personaContexts);
        return evaluator.doIt(evaluator, goalContextCondition);

    }

    public boolean evaluateTaskExpression(Plan task) {
        String taskContextCondition = task.getCreationProperty();
        // Retira assertion condition da string
        taskContextCondition = taskContextCondition.substring(20);
        TreeBooleanEvaluator evaluator = new TreeBooleanEvaluator(this.personaContexts);
        return evaluator.doIt(evaluator, taskContextCondition);
    }

    public void informFailure(String failedNodeName) {
        System.out.println("Error at " + failedNodeName + ".Logical proposition is false");
    }

    public void informTotalFailure(String failedNodeName) {
        System.out.println("Error at " + failedNodeName + ".Conditions not met for persona");
    }

    public String personaAchievabilityFailure(Persona persona){
        return "The current persona does not meet the CGM context conditions\n" +
                "Persona info: \n" +
                "Name: "+ persona.getName() + "\n" +
                "Description: " + persona.getDescription() + "\n" +
                "Failed node: " + this.failedNodeName;
    }

    public String personaAchievabilitySuccess(Persona persona){
        return "The current persona meets the CGM context conditions\n" +
                "Persona info: \n" +
                "Name: "+ persona.getName() + "\n" +
                "Description: " + persona.getDescription();
    }
}
