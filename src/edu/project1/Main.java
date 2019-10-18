package edu.project1;

import edu.project1.evaluator;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class Main {
    private static JFrame frame;
    private static JLabel resultLabel;
    private static JLabel result;
    private static JPanel controlPanel;
    private static JTextField expressionField;

    public static void main(String[] args) {
        frame = new JFrame("Project 1 Infix Calculator ");
        frame.setSize(500, 350);
        frame.setLayout(new GridLayout(3, 2));
        controlPanel = new JPanel();
        controlPanel.setLayout(new FlowLayout());
        frame.add(controlPanel);


        //Close frame
        frame.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent windowEvent) {
                System.exit(0);
            }
        });
        //END


        JLabel expressionLabel = new JLabel("Enter InfixExpression: ");
        expressionField = new JTextField(10);
        JButton evaluateButton = new JButton("Evaluate");
        evaluateButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String data = expressionField.getText();
                result.setText(data);

            }
        });

        controlPanel.add(expressionLabel);
        controlPanel.add(expressionField);
        controlPanel.add(evaluateButton);

        resultLabel = new JLabel("Result:");
        resultLabel.setSize(450, 100);
        controlPanel.add(resultLabel);
        result = new JLabel("");
        result.setSize(350, 100);
        controlPanel.add(result);

        frame.setVisible(true);

    }


}