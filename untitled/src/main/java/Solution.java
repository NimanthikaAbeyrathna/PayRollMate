import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int lineNumber = 1;
        while(scanner.hasNext()){
            String text = scanner.nextLine();
            System.out.println(lineNumber+" "+text);
            lineNumber++;
        }
    }
}
