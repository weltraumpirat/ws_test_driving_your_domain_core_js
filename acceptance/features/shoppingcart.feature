Feature: A Shopping Cart Example

  Background:
    Given the following available products:
      | Id | Name              | PackagingType | Amount | Price    |
      | 1  | Whole Milk        | Carton        | 1l     | 1.19 EUR |
      | 2  | Whole Milk        | Carton        | 0.5l   | 0.69 EUR |
      | 3  | White Bread       | Loaf          | 500g   | 1.19 EUR |
      | 4  | Whole Wheat Bread | Loaf          | 500g   | 1.59 EUR |
      | 5  | Organic Bread     | Loaf          | 500g   | 2.19 EUR |
      | 6  | Butter            | Pack          | 250g   | 1.69 EUR |
      | 7  | Organic Butter    | Pack          | 250g   | 2.39 EUR |

  Scenario: Empty
    Given the empty shopping cart
    Then the shopping cart is empty

  Scenario: Adding an item
    Given the empty shopping cart
    When I add the following item:
      | Id | Name       | PackagingType | Amount | Price    |
      | 1  | Whole Milk | Carton        | 1l     | 1.19 EUR |
    Then the shopping cart contains 1 item
    And the first item is "Whole Milk"

  Scenario: Removing an item
    Given the shopping cart contains the following items:
      | Id | Name       | PackagingType | Amount | Price    |
      | 1  | Whole Milk | Carton        | 1l     | 1.19 EUR |
    When I remove the following item:
      | Id | Name       | PackagingType | Amount | Price    |
      | 1  | Whole Milk | Carton        | 1l     | 1.19 EUR |
    Then the shopping cart is empty

  Scenario: Checkout
    Given the shopping cart contains the following items:
      | Id | Name           | PackagingType | Amount | Price    |
      | 1  | Whole Milk     | Carton        | 1l     | 1.19 EUR |
      | 2  | Whole Milk     | Carton        | 1l     | 1.19 EUR |
      | 3  | Organic Butter | Pack          | 250g   | 2.39 EUR |
    When I proceed to check out
    Then the following order with id "1" and a total amount due of "4.77 EUR" is created:
      | Position | ItemName                  | Count | SinglePrice | CombinedPrice |
      | 1        | Whole Milk, 1l Carton     | 2     | 1.19 EUR    | 2.38 EUR      |
      | 2        | Organic Butter, 250g Pack | 1     | 2.39 EUR    | 2.39 EUR      |
