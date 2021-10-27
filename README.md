# fittoparent
Javascript (JQuery dependent) library that ensures text will perfectly fit to the parent div, in a single line, even as the div and/or page resizes

## JQuery dependency

The library is dependent on JQuery (in the future I may work on a vanilla js version). Therefore you will need to first include JQuery in your project/pages before using the library. The library was created in late 2016 so it should work with JQuery libraries from since then till present.

## Known limitations

There are some fonts that do not work well with the library that I should over time find fixes for should I continue working on the library.

## Include in your project/page

```HTML
<head>
  <link rel="stylesheet" href="FitToParent.css>
</head>
<body>
  <!-- your html here -->
  <div id="text_parent">
    <div id="text">Text that must perfectly fit to the parent element<div>
  </div>
                               
  <!-- your jquery script before the library -->
  <script src="FitToParent.js"></script>
  <!-- your scripts that use the library -->
</body>
```

## Usage

    // The element that must fit to its parent
    const $elem = $("#text");
    
    // The percentage of the max width that the element should occupy in parent (default = 100).
    const maxWidthPerc = 100;
    
    // The percentage of the max height that the element should occupy in parent (default = 100).
    const maxHeightPerc = 100;
    
    // When multiple elements are being resized and the desire is to have them share the same font-size at the end
    // then you assign the same group (string) to them. Otherwise leave as null (default = null).
    const group = null
    
    // How the text should align in the parent (default = "left").
    const tAlign = "left";
    
    // Font family (default = "'Roboto Condensed', sans-serif" [Roboto Condensed if available otherwise sans-serif])
    const fontFamily = "'Roboto Condensed', sans-serif";
    
    // If set to false then the element will not resize on the window resize event 
    // but will require the .resize() method to be called on the FitToParent object representing the element (default = true)
    const autoResize = true;
    
    // You can store returned object in a variable if you need to access it.
    new FitToParent($elem, maxWidthPerc, maxHeightPerc, group, tAlign, fontFamily, autoResize);
