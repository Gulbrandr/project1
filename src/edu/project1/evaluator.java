package edu.project1;
import java.util.StringTokenizer;
import java.util.Stack;

/*
tokenize the string containing the expression
while there are more tokens
    get the next token
    if it is an operand
        push it onto the operand stack
    else if it is a left parenthesis
        push it onto the operator stack
    else if it is a right parenthesis
        while top of the operator stack not a left parenthesis
            pop two operands and an operator
            perform the calculation
            push the result onto the operand stack
        else if it is an operator
        while the operator stack is not empty and
            the operator at the top of the stack has higher
            or the same precedence than the current operator
            pop two operands and perform the calculation
            push the result onto the operand stack
        push the current operator on the operators stack
while the operator stack is not empty
    pop two operands and an operator
    perform the calculation
    push the result onto the operand stack
the final result is a the top of the operand stack
 */
public class evaluator {

    private static String input;
    private static double output;
    private static StringTokenizer tokenizedInput;
    private static Stack<String> operandStack = new Stack<>();
    private static Stack<String> operatorStack = new Stack<>();


    public static double evaluator(String input) {

        String[] operandArray = input.split("[^0-9]");
        String[] operatorArray = input.split("[0-9]");
        String currentToken;
        for(int i = 0; i<operandArray.length; i++){
           currentToken = operandArray[i];
           System.out.println("Operand:" + currentToken);
        }
        for(int i = 0; i<operatorArray.length; i++){
            currentToken = operatorArray[i];
            System.out.println("Operator: " +currentToken);
        }
      /*START: create Stacks from input Tokenizer
       tokenizedInput = new StringTokenizer(input);
        output = tokenizedInput.countTokens();

       while(tokenizedInput.hasMoreTokens()){
           String currentToken = tokenizedInput.nextToken();
           if(currentToken.contentEquals("+") || currentToken.contentEquals("-") || currentToken.contentEquals("/")|| currentToken.contentEquals("*")|| currentToken.contentEquals("(")|| currentToken.contentEquals(")")){
               operatorStack.push(currentToken);
               System.out.println("Operator: " + currentToken);
           }else{
               operandStack.push(currentToken);
               System.out.println("Operand:" + currentToken);
           }
       }
       */
     return output;
    }
    public static void main(String[] args) {
          System.out.println(evaluator("(6+20)+30-10/6"));
    }
}