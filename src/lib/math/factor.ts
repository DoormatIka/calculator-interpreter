
import { gcd } from "./gcd.js";

// from geeksforgeeks, dixon's prime factorization algorithm.
export function factor(n: number) {
    // Factor base for the given number
    let base = [2, 3, 5, 7];
  
    // Starting from the ceil of the root
    // of the given number N
    let start = Math.floor(Math.sqrt(n));
  
    // Storing the related squares
    let pairs = [];
     
    // For every number from the square root 
    // Till N
    let len= base.length;
    for(let i = start; i < n; i++)
    {
        // Finding the related squares 
        for(let j = 0; j < len; j++)
        {
            let lhs = (i ** 2)% n;
            let rhs = ((base[j] ** 2)) % n;
              
            // If the two numbers are the 
            // related squares, then append
            // them to the array 
            if(lhs == rhs)
            {
                pairs.push([i, base[j]]);
            }
                 
        }
    }
 
    let newvec = [];
  
    // For every pair in the array, compute the 
    // GCD such that 
    len = pairs.length;


    for (let i = 0; i < len;i++){
        let factor = gcd(pairs[i][0] - pairs[i][1], n);
          
        // If we find a factor other than 1, then 
        // appending it to the final factor array
        if(factor != 1)
            newvec.push(factor);
  
    }
     
    let s = new Set(newvec);
    return [...s]
}
