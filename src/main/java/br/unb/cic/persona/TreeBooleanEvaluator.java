package br.unb.cic.persona;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.fathzer.soft.javaluator.*;

public class TreeBooleanEvaluator extends AbstractEvaluator<String> {
    /** The negate unary operator.*/
    final static Operator NEGATE = new Operator("!", 1, Operator.Associativity.RIGHT, 3);
    /** The logical AND operator.*/
    final static Operator AND = new Operator("&", 2, Operator.Associativity.LEFT, 2);
    /** The logical OR operator.*/
    final static Operator OR = new Operator("|", 2, Operator.Associativity.LEFT, 1);

    private static final Parameters PARAMETERS;
    protected List<String> cgmContextList;
    protected List<String> personaContextList;


    static {
        // Create the evaluator's parameters
        PARAMETERS = new Parameters();
        // Add the supported operators
        PARAMETERS.add(AND);
        PARAMETERS.add(OR);
        PARAMETERS.add(NEGATE);
        // Add the parentheses
        PARAMETERS.addExpressionBracket(BracketPair.PARENTHESES);
    }

    public TreeBooleanEvaluator(List<String> personaContexts) {
        super(PARAMETERS);
//        this.cgmContextList = cgmContexts;
        this.personaContextList = personaContexts;
    }

    @Override
    protected String toValue(String literal, Object evaluationContext) {
        return literal;
    }

    private boolean getValue(String literal) {
        if (this.personaContextList.contains(literal) || literal.endsWith("=true")) return true;
        else if (!this.personaContextList.contains(literal) || literal.endsWith("=false")) return false;
        throw new IllegalArgumentException("Unknown literal : "+literal);
    }

    @Override
    protected String evaluate(Operator operator, Iterator<String> operands,
                              Object evaluationContext) {
        List<String> tree = (List<String>) evaluationContext;

        String o1 = operands.next();
        String o2 = "";
        if(operator != NEGATE){
            o2 = operands.hasNext() ? operands.next() : o1;
        }
        String eval;
        Boolean result;
        if(operator == NEGATE) {
            result = !getValue(o1);
        }
        else if (operator == OR) {
            result = getValue(o1) || getValue(o2);
        } else if (operator == AND) {
            result = getValue(o1) && getValue(o2);
        } else {
            throw new IllegalArgumentException();
        }
        if(operator != NEGATE){
            eval = "("+o1+" "+operator.getSymbol()+" "+o2+")="+result;
        } else {
            eval = "("+operator.getSymbol()+" "+o1+")="+result;
        }
        tree.add(eval);
        return eval;
    }

//    public static void main(String[] args) {
//        TreeBooleanEvaluator evaluator = new TreeBooleanEvaluator();
//        doIt(evaluator, "T & ( F | ( F & T ) )");
//        doIt(evaluator, "(T & T) | ( F & T )");
//    }

    public boolean doIt(TreeBooleanEvaluator evaluator, String expression) {
        if(!expression.contains("&") && !expression.contains("|") && !expression.contains("!")){
            expression = correctExpression(expression);
        }
        List<String> sequence = new ArrayList<String>();
        evaluator.evaluate(expression, sequence);
        System.out.println ("Evaluation sequence for :"+expression);
        for (String string : sequence) {
            System.out.println (string);
        }
        int sequenceSize = sequence.size();
        return this.evaluateExpressionsResult(sequence.get(sequenceSize-1)); // última expressão
    }

    /*
    Cuida de expressões com um só operando
     */
    private String correctExpression(String expression) {
        return expression + " & " + expression;
    }

    private boolean evaluateExpressionsResult(String sequence){
        String substr;
        int equalPosition = sequence.lastIndexOf("=");
        substr = sequence.substring(equalPosition+1, sequence.length());
        boolean retorno = !substr.equals("false");
        return retorno;
    }
}