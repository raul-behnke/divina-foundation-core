// Shopify Storefront API — Customer (classic) accounts
import { storefrontApiRequest } from "@/lib/shopify";

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface CustomerAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip: string | null;
  phone: string | null;
}

export interface CustomerOrderLine {
  title: string;
  quantity: number;
  variant: { image: { url: string; altText: string | null } | null; title: string } | null;
}

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  statusUrl: string;
  currentTotalPrice: { amount: string; currencyCode: string };
  lineItems: { edges: Array<{ node: CustomerOrderLine }> };
}

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
  defaultAddress: CustomerAddress | null;
  addresses: { edges: Array<{ node: CustomerAddress }> };
  orders: { edges: Array<{ node: CustomerOrder }> };
}

type UserError = { field: string[] | null; message: string };

function firstErrorMessage(errors: UserError[] | undefined): string | null {
  if (!errors || errors.length === 0) return null;
  return errors[0].message;
}

const CUSTOMER_FIELDS = `
  id firstName lastName email phone acceptsMarketing
  defaultAddress { id firstName lastName address1 address2 city province country zip phone }
  addresses(first: 10) {
    edges { node { id firstName lastName address1 address2 city province country zip phone } }
  }
  orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
    edges {
      node {
        id orderNumber processedAt financialStatus fulfillmentStatus statusUrl
        currentTotalPrice { amount currencyCode }
        lineItems(first: 20) {
          edges {
            node {
              title quantity
              variant { title image { url altText } }
            }
          }
        }
      }
    }
  }
`;

export async function customerLogin(
  email: string,
  password: string
): Promise<{ token: CustomerAccessToken | null; error: string | null }> {
  const data = await storefrontApiRequest<any>(
    `mutation login($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { field message }
      }
    }`,
    { input: { email, password } }
  );
  const payload = data?.data?.customerAccessTokenCreate;
  const error = firstErrorMessage(payload?.customerUserErrors);
  return { token: payload?.customerAccessToken ?? null, error };
}

export async function customerSignup(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}): Promise<{ error: string | null }> {
  const data = await storefrontApiRequest<any>(
    `mutation signup($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerUserErrors { field message }
      }
    }`,
    { input }
  );
  return { error: firstErrorMessage(data?.data?.customerCreate?.customerUserErrors) };
}

export async function customerRecover(email: string): Promise<{ error: string | null }> {
  const data = await storefrontApiRequest<any>(
    `mutation recover($email: String!) {
      customerRecover(email: $email) { customerUserErrors { field message } }
    }`,
    { email }
  );
  return { error: firstErrorMessage(data?.data?.customerRecover?.customerUserErrors) };
}

export async function customerLogout(token: string): Promise<void> {
  await storefrontApiRequest(
    `mutation logout($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        userErrors { field message }
      }
    }`,
    { customerAccessToken: token }
  );
}

export async function fetchCustomer(token: string): Promise<Customer | null> {
  const data = await storefrontApiRequest<any>(
    `query getCustomer($token: String!) {
      customer(customerAccessToken: $token) { ${CUSTOMER_FIELDS} }
    }`,
    { token }
  );
  return data?.data?.customer ?? null;
}

export async function customerUpdate(
  token: string,
  input: { firstName?: string; lastName?: string; phone?: string; email?: string; password?: string }
): Promise<{ error: string | null }> {
  const data = await storefrontApiRequest<any>(
    `mutation update($token: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $token, customer: $customer) {
        customerUserErrors { field message }
      }
    }`,
    { token, customer: input }
  );
  return { error: firstErrorMessage(data?.data?.customerUpdate?.customerUserErrors) };
}
