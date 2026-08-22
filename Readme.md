# Procedure

1. Start the program.

2. Create a `BubbleSort` class with a `bubble_sort()` function that accepts an integer array.

3. Find the size of the array and store it in `n`.

4. Use an outer loop starting from the last index of the array and move toward the first index.

5. Initialize a variable `didSwap` to `0` at the beginning of each outer-loop iteration.

6. Use an inner loop to compare adjacent elements from the beginning of the array up to the current unsorted portion.

7. If the current element is greater than the next element, swap the two elements and set `didSwap` to `1`.

8. After completing an inner-loop iteration, check the value of `didSwap`.

9. If `didSwap` remains `0`, no elements were swapped, which means the array is already sorted. Stop the sorting process using `break`.

10. Repeat the process until all elements are sorted.

11. Display the sorted array.

12. End the program.
