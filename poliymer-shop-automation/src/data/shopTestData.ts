/**
 * Test Data for Polymer Shop QA Automation
 */

export const shopData = {
  validCustomer: {
    email: 'qa.ravi@example.com',
    first_name: 'Ravi',
    last_name: 'Kiran',
    address: '42 Tech Park Road',
    city: 'Hyderabad',
    zip_code: '500081',
    phone: '9876543210',
    country: 'India',
  },

  invalidCustomer: {
    email: 'not-an-email',
    first_name: '',
    last_name: 'Test',
    address: '123 Test St',
    city: 'Test City',
    zip_code: '12345',
    phone: '0000000000',
  },

  validPayment: {
    card_number: '4111111111111111',
    expiry_date: '12/26',
    cvv: '456',
  },

  invalidPayment: {
    card_number: '1234567890000000',
    expiry_date: '01/20',
    cvv: '000',
  },

  searchProducts: ['outerwear', 'tshirt', 'jacket', 'ladies', 'mens'],

  invalidSearchQueries: ['', '   ', '!@#$%^&*()', 'xxxxxxxxxxxxxxxxxxxxxxxxxxx'],

  validQuantities: [1, 2, 3, 5],

  multipleCustomers: [
    {
      email: 'user1@example.com',
      first_name: 'Alice',
      last_name: 'Sharma',
      address: '10 MG Road',
      city: 'Bangalore',
      zip_code: '560001',
      phone: '9876500001',
    },
    {
      email: 'user2@example.com',
      first_name: 'Bob',
      last_name: 'Reddy',
      address: '22 Jubilee Hills',
      city: 'Hyderabad',
      zip_code: '500033',
      phone: '9876500002',
    },
    {
      email: 'user3@example.com',
      first_name: 'Carol',
      last_name: 'Nair',
      address: '5 Anna Salai',
      city: 'Chennai',
      zip_code: '600002',
      phone: '9876500003',
    },
  ],
};
