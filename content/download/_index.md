---
title: Why Multimodal <br> Data Needs a Better <br> Lakehouse?
description: Today’s lakehouses were built for tables, not tensors. It’s time for a data foundation that speaks the language of multimodal AI.
highlighted: Lakehouse
badge: Research Study
image: images/lakehouse.png
image_mob: images/lakehouse-mob.png
image_alt: Multimodal Lakehouse
vector: static/assets/vectors/download.svg
download: 
  title: "We explore the challenges and limitations of current data lakehouse architectures in handling multimodal data, crucial to modern machine learning and AI workloads:"
  list: 
    - Current lakehouses lack native support for unstructured data like images, audio, and video.
    - AI and ML workloads depend on smooth handling of diverse, multimodal data types.
    - A better lakehouse should unify storage, metadata, and fast access across all modalities.
  info: We propose design principles and potential system enhancements for a new generation of multimodal lakehouses, aiming to bridge the gap between traditional data infrastructure and the needs of large-scale, AI-driven applications.
  form:
    title: Download Your Copy
    embeded: '<script charset="utf-8" type="text/javascript" src="//js-na2.hsforms.net/forms/embed/v2.js"></script>
    <script>
      hbspt.forms.create({
        portalId: "242023405",
        formId: "2304383a-68a1-4eba-8960-b2d84f493ded",
        region: "na2"
      });
    </script>'
    success:
      title: Thank you
      description: We’ve received your submission. 
      addition: "You can download your resource below:"
      button:
        href: https://learn.lancedb.com/hubfs/lancedb-multimodal-lakehouse.pdf
        version: secondary
        text: Download copy
        icon: true
    fields: # if need custom 
      - label: Last Name
        name: last_name
        type: text
        placeholder: Your last name
        requared: false
        half: true
      - label: First name
        name: first_name
        type: text  
        placeholder: Your First name
        requared: false
        half: true
      - label: Email
        name: email
        type: email
        placeholder: Your email
        requared: true
        half: true
      - label: Company name
        name: company_name
        type: text
        placeholder: You comapny name
        requared: true
        half: true
      - label: I agree to receive promotional communications from LanceDB
        name: agreement
        type: checkbox
        requared: true
        half: false
    submit_action: //
    submit_button:
      text: Download the Paper
      icon: true
      variant: primary
    form_info: By submitting, you agree to our [Privacy Policy](https://cdn.prod.website-files.com/6846da01d1da6e05973b02a0/685157c58b8986967135d6d2_LanceDB%20Privacy%20Policy.pdf) and allow LanceDB to store and process the information above to provide you with the content requested.
compliance: 
  title: Enterprise-Grade Compliance
  description: Safety and security guaranteed for your data.
  cards:
    - text: 
        mobile: SOC2 
        desktop: SOC2 Type II
      icon: aicpa.svg
    - text:
        mobile: GDPR 
        desktop: GDPR compliant
      icon: gdpr.svg
    - text: 
        mobile: HIPAA 
        desktop: HIPAA compliant
      icon: hipaa.svg
cta: 
  type: logo
  logo: static/assets/logo-cta.svg
  description: Go native with LanceDB, built for multimodal intelligence.
  vectors:
    left: /assets/vectors/cta-left.svg
    right: /assets/vectors/cta-right.svg

---