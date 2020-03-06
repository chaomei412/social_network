import java.util.*;
class MyClassTwo
{
	public static void main(String args[]) 
    { 
			System.out.println(getSumOfNumbers());
    }  
	public static int getSumOfNumbers(String s)
	{
      if(s==null)
		         throw new AlsCustomException("Hnadle Exception");
		String[] arrOfStr = s.split("[ ]+");	
		int sum;
		sum=0;
		for (String a : arrOfStr) 	
		{
			try
			{
				sum+=Integer.parseInt(a);
			}catch(Exception ex){}
			}
		return sum;
	}	
}