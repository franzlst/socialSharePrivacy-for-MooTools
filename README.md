socialSharePrivacy for MooTools
===============================

socialSharePrivacy for MooTools | 2 clicks for more privacy
This is the MooTools version of the jQuery-plugin socialSharePrivacy of the "Heise Zeitschriftenverlags", made by Franz Steinmetz.

More information about the original plugin and the options can be found in the file Source/original/index.html

![Screenshot](http://www.franework.de/assets/socialshareprivacy/2-klick-logo_min.jpg)

How to use
----------

Add a block element, such as div, with the class "socialshareprivacy" to your document, at the position where you want to place your buttons. You can have several of that buttons at different places on the same document.

<div class="socialshareprivacy"></div>

Then call the new method socialSharePrivacy of the Element class, when the page was loaded:

window.addEvent('domready', function() { 
	
	document.getElements('.socialshareprivacy').each(function(element) {
		element.socialSharePrivacy();
	});

});

You can also pass options to the plugin (for more details, see index.html):
    
element.socialSharePrivacy({ // only activate facebook
    services : {
        twitter : {
            'status' : 'off'
        },
        gplus : {
            'status' : 'off'
        }
    }
});

Screenshots
-----------

Here you can see the dimensions of the plugin:

![Screenshot 1](http://www.franework.de/assets/socialshareprivacy/dimensions.gif)

Licence
-----------------

Copyright (c) 2011 Franz Steinmetz, http://www.franework.de

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
