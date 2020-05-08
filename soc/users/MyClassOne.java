import java.util.*;
import java.util.Arrays;
class MyClassOne
{
	public static int [] retainPositiveNumber(int [] a)
	{
		int count;
		count=0;
		for (int no : a) 	
		{
			if(no>=0)
				count++;
		}
		int ret_no[]=new int[count];
		int i;
		i=0;
		for(int no : a) 
		{
			if(no>=0)
				ret_no[i++]=no;
		}
	return ret_no;	
	}
	public static void main(String args[]) 
    { 
		int [] temp_array={-9,-16,9};
		System.out.print(Arrays.toString(retainPositiveNumber(temp_array)));
	}
}