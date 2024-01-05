import {
  reactExtension,
  useApi,
  useCustomer,
  useCartLines,
  Button,
  Text,
  BlockStack,
  Link
} from '@shopify/ui-extensions-react/checkout';

import React, { useState, useEffect } from 'react';

const thankYouPage = reactExtension(
  'purchase.thank-you.block.render',
  () => <Extension />,
);

export { thankYouPage };
function Extension() {
  const [hasPGC, setHasPGC] = useState(0);
  const [hasAKK, setHasAKK] = useState(0);
  const [hasPMD, setHasPMD] = useState(0);
  const [hasGIR, setHasGIR] = useState(0);
  const [hasWSProducts, setHasWSProducts] = useState(0);
  const [hasNutrition, setHasNutrition] = useState(0);
  const [hasOneTimeProducts, setOneTimeProducts] = useState(0);
  const [noSurvey, setNoSurvey] = useState(0);
  const [notHCP, setNotHCP] = useState(0);
  const [surveyLink, setSurveyLink] = useState("");
  const [surveyID, setSurveyID] = useState(0);
  const [email, setEmail] = useState(0);

  const { query } = useApi();
  let customer = useCustomer();
  let cartLines = useCartLines();

  useEffect(() => {
    async function apiCalls() {
      // This code is for getting lines sku
      let linesLength = cartLines.length;
      for (var i = 0; i < linesLength; ++i) {
        let variantId = cartLines[i].merchandise.id;
        let productIdRaw = cartLines[i].merchandise.product.id;
        let productIdRawSplit = productIdRaw.split("/");
        let productId = productIdRawSplit[productIdRawSplit.length - 1];
        if (productId == "6546487541814") {
          setHasNutrition(true);
        }
        const data = await query(
          `{
              node(id:"${variantId}") {
                ...on ProductVariant {
                  sku
                }
              }
            
          }`
        );
        let sku = data?.data?.node?.sku;
        if (sku) {
          if (sku.includes("PGC-01-MEM")) {
            setHasPGC(() => true);
            setSurveyLink(() => "https://brsjysuxsfj.typeform.com/to/R2UREAFP?email_address=");
          } else if (sku.includes("AMUC-01-MEM")) {
            setHasAKK(() => true);
            setSurveyLink(() => "https://brsjysuxsfj.typeform.com/to/T91lkA8l?email_address=");
          } else if (sku.includes("PMD-01-MEM")) {
            setHasPMD(() => true);
            setSurveyLink(() => "https://brsjysuxsfj.typeform.com/to/nYy9pgW2?email_address=");
          } else if (sku.includes("GIR-01-MEM")) {
            setHasGIR(() => true);
            setSurveyLink(() => "https://brsjysuxsfj.typeform.com/to/cIKupM9y?email_address=");
          } else if (sku.includes("PGC-03-OTP") || sku.includes("AMUC-01-OTP") || sku.includes("GIR-01-OTP") || sku.includes("PMD-01-OTP")) {
            setOneTimeProducts(() => true);
            setSurveyLink(() => true);
          } else {
            setNoSurvey(() => true);
          }
          if (sku.includes("-US")) {
            setHasWSProducts(() => true);
          }
        }
      }
      // code for getting customer info
      let customerId = customer?.id;
      if (customerId) {
        const data = await query(
          `{
          customer(id: "${customerId}"){
            tags
            numberOfOrders
            email
          }
        }`
        );
        // console.log(data);
        let tags = data?.data?.customer?.tags;
        let ordersCount = data?.data?.customer?.numberOfOrders;
        setEmail(() => data?.data?.customer?.email);
        if (tags?.length && tags?.includes("WS") && hasWSProducts) {
          if (ordersCount > 1) {
            setSurveyID(() => "ByDeZJHV");
            setNotHCP(() => false);
          } else {
            setSurveyID(() => "IQ7fmJKu");
            setNotHCP(() => false);
          }
        }
      }
      if (!hasPGC) {
        setHasNutrition(() => false);
      }
    }
    apiCalls();
  }, []);

  return (
    surveyLink ?
      <BlockStack>
        <Text>
          Please complete 5-second survey so we can better learn.
        </Text>
        <Link external to={surveyLink + email}>
          <Button kind="primary">
            Take Survey
          </Button>
        </Link>
      </BlockStack>
      : null
  );
} 