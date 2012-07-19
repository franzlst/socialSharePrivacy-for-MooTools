/*
---
description: socialSharePrivacy for MooTools | 2 clicks for more privacy

license: MIT License http://www.opensource.org/licenses/mit-license.php

authors:
- Franz Steinmetz

requires:
- core

provides: [Element.socialSharePrivacy]

...
*/
/*
 * socialSharePrivacy for MooTools | 2 clicks for more privacy
 * This is the MooTools version of the jQuery-plugin socialSharePrivacy of the "Heise Zeitschriften Verlag GmbH & Co. KG" (see below), made by Franz Steinmetz.
 * 
 * For more information, see Readme.md, index.html and the folowing links:
 *
 * http://www.heise.de/extras/socialshareprivacy/
 * http://www.heise.de/ct/artikel/2-Klicks-fuer-mehr-Datenschutz-1333879.html
 * 
 * mootools.socialshareprivacy.js licence:
 * 
 * Copyright (c) 2011 Franz Steinmetz, http://www.franework.de
 *
 * is released under the MIT License http://www.opensource.org/licenses/mit-license.php
 * 
 * jquery.socialshareprivacy.js licence:
 *
 * Copyright (c) 2011 Hilko Holweg, Sebastian Hilbig, Nicolas Heiringhoff, Juergen Schmidt,
 * Heise Zeitschriften Verlag GmbH & Co. KG, http://www.heise.de
 *
 * is released under the MIT License http://www.opensource.org/licenses/mit-license.php
 *
 * Spread the word, link to us if you can.
 */
(function () {

    "use strict";

	/*
	 * helper functions
	 */ 

    // abbreviate at last blank before length and add "\u2026" (horizontal ellipsis)
    function abbreviateText(text, length) {
        var abbreviated = decodeURIComponent(text);
        if (abbreviated.length <= length) {
            return text;
        }

        var lastWhitespaceIndex = abbreviated.substring(0, length - 1).lastIndexOf(' ');
        abbreviated = encodeURIComponent(abbreviated.substring(0, lastWhitespaceIndex)) + "\u2026";

        return abbreviated;
    }

    // returns content of <meta name="" content=""> tags or '' if empty/non existant
    function getMeta(name) {
		var metaElement = document.getElement('meta[name="' + name + '"]');
		if(! metaElement)
			return '';
        var metaContent = metaElement.getProperty('content');
        return metaContent || '';
    }
    
    // create tweet text from content of <meta name="DC.title"> and <meta name="DC.creator">
    // fallback to content of <title> tag
    function getTweetText() {
        var title = getMeta('DC.title');
        var creator = getMeta('DC.creator');

        if (title.length > 0 && creator.length > 0) {
            title += ' - ' + creator;
        } else {
            title = document.getElement('title').get('html');
        }

        return encodeURIComponent(title);
    }

    // build URI from rel="canonical" or document.location
    function getURI() {
        var uri = document.location.href;
		var relCanonical = document.getElement('link[rel=canonical]');
		var canonical = relCanonical ? relCanonical.getProperty('href') : null;

        if (canonical && canonical.length > 0) {
            if (canonical.indexOf("http") < 0) {
                canonical = document.location.protocol + "//" + document.location.host + canonical;
            }
            uri = canonical;
        }

        return uri;
    }

    function cookieSet(name, value, days, path, domain) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + '; expires=' + expires.toUTCString() + '; path=' + path + '; domain=' + domain;
    }
    function cookieDel(name, value, path, domain) {
        var expires = new Date();
        expires.setTime(expires.getTime() - 100);
        document.cookie = name + '=' + value + '; expires=' + expires.toUTCString() + '; path=' + path + '; domain=' + domain;
    }

    // extend jquery with our plugin function
	// Element.prototype.socialSharePrivacy = function (settings) {
	Element.implement({
		socialSharePrivacy: function (settings) {
			var defaults = {
				'services' : {
					'facebook' : {
						'status'            : 'on',
						'dummy_img'         : 'socialshareprivacy/images/dummy_facebook.png',
						'txt_info'          : '2 Klicks f&uuml;r mehr Datenschutz: Erst wenn Sie hier klicken, wird der Button aktiv und Sie k&ouml;nnen Ihre Empfehlung an Facebook senden. Schon beim Aktivieren werden Daten an Dritte &uuml;bertragen &ndash; siehe <em>i</em>.',
						'txt_fb_off'        : 'nicht mit Facebook verbunden',
						'txt_fb_on'         : 'mit Facebook verbunden',
						'perma_option'      : 'on',
						'display_name'      : 'Facebook',
						'referrer_track'    : '',
						'language'          : 'de_DE',
						'action'            : 'recommend'
					}, 
					'twitter' : {
						'status'            : 'on', 
						'dummy_img'         : 'socialshareprivacy/images/dummy_twitter.png',
						'txt_info'          : '2 Klicks f&uuml;r mehr Datenschutz: Erst wenn Sie hier klicken, wird der Button aktiv und Sie k&ouml;nnen Ihre Empfehlung an Twitter senden. Schon beim Aktivieren werden Daten an Dritte &uuml;bertragen &ndash; siehe <em>i</em>.',
						'txt_twitter_off'   : 'nicht mit Twitter verbunden',
						'txt_twitter_on'    : 'mit Twitter verbunden',
						'perma_option'      : 'on',
						'display_name'      : 'Twitter',
						'referrer_track'    : '', 
						'tweet_text'        : getTweetText,
						'language'          : 'en'
					},
					'gplus' : {
						'status'            : 'on',
						'dummy_img'         : 'socialshareprivacy/images/dummy_gplus.png',
						'txt_info'          : '2 Klicks f&uuml;r mehr Datenschutz: Erst wenn Sie hier klicken, wird der Button aktiv und Sie k&ouml;nnen Ihre Empfehlung an Google+ senden. Schon beim Aktivieren werden Daten an Dritte &uuml;bertragen &ndash; siehe <em>i</em>.',
						'txt_gplus_off'     : 'nicht mit Google+ verbunden',
						'txt_gplus_on'      : 'mit Google+ verbunden',
						'perma_option'      : 'on',
						'display_name'      : 'Google+',
						'referrer_track'    : '',
						'language'          : 'de'
					}
				},
				'info_link'         : 'http://www.heise.de/ct/artikel/2-Klicks-fuer-mehr-Datenschutz-1333879.html',
				'txt_help'          : 'Wenn Sie diese Felder durch einen Klick aktivieren, werden Informationen an Facebook, Twitter oder Google in die USA &uuml;bertragen und unter Umst&auml;nden auch dort gespeichert. N&auml;heres erfahren Sie durch einen Klick auf das <em>i</em>.',
				'settings_perma'    : 'Dauerhaft aktivieren und Daten&uuml;ber&shy;tragung zustimmen:',
				'cookie_path'       : '/',
				'cookie_domain'     : document.location.host,
				'cookie_expires'    : '365',
				'css_path'          : 'socialshareprivacy/socialshareprivacy.css',
				'uri'               : getURI
			};

			// Standardwerte des Plug-Ings mit den vom User angegebenen Optionen ueberschreiben
			var options = Object.merge(defaults, settings);

			var facebook_on = (options.services.facebook.status === 'on');
			var twitter_on  = (options.services.twitter.status  === 'on');
			var gplus_on    = (options.services.gplus.status    === 'on');

			// check if at least one service is "on"
			if (!facebook_on && !twitter_on && !gplus_on) {
				return;
			}
			// insert stylesheet into document and prepend target element
			if (options.css_path.length > 0) {
				var a = new Element('link', { rel: 'stylesheet', type: 'text/css',  href: options.css_path  });
				document.head.grab(a);
			}
			
			
			var context = new Element('ul.social_share_privacy_area');
			document.id(this).grab(context);

			// canonical uri that will be share
			var uri = options.uri;
			if (typeof uri === 'function') {
				uri = uri();
			}


			//
			// Facebook
			//
			if (facebook_on) {
				var fb_enc_uri = encodeURIComponent(uri + options.services.facebook.referrer_track);
				var fb_code = new IFrame({ 
					src: 'http://www.facebook.com/plugins/like.php?locale=' + options.services.facebook.language + '&href=' + fb_enc_uri + '&send=false&layout=button_count&width=120&show_faces=false&action=' + options.services.facebook.action + '&colorscheme=light&height=21&font',
					scrolling: 'no',
					frameborder: 0,
					styles: { border: 'none', overflow: 'hidden', width:145, height:21 },
					allowTransparency: true
				});
				var fb_dummy_btn = new Element('img.fb_like_privacy_dummy', { src: options.services.facebook.dummy_img, alt: 'Facebook &quot;Like&quot;-Dummy'});
				
				context.grab((new Element('li.facebook.help_info')).set('html', '<span class="info">' + options.services.facebook.txt_info + '</span><span class="switch off">' + options.services.facebook.txt_fb_off + '</span><div class="fb_like dummy_btn"></div>'));
				var $container_fb = context.getElement('li.facebook');
				$container_fb.getElement('.fb_like').grab(fb_dummy_btn);

				var facebookClickFunction = function () {
					if ($container_fb.getElement('span.switch').hasClass('off')) {
						$container_fb.addClass('info_off');
						$container_fb.getElement('span.switch').addClass('on').removeClass('off').set('html', options.services.facebook.txt_fb_on);
						$container_fb.getElement('.fb_like').empty().grab(fb_code);
					} else {
						$container_fb.removeClass('info_off');
						$container_fb.getElement('span.switch').addClass('off').removeClass('on').set('html', options.services.facebook.txt_fb_off);
						$container_fb.getElement('.fb_like').empty().grab(fb_dummy_btn);
					}
				}.bind(this);
				
				context.getElement('li.facebook div.fb_like img.fb_like_privacy_dummy').addEvent('click', facebookClickFunction);
				context.getElement('li.facebook span.switch').addEvent('click', facebookClickFunction);
			}

			//
			// Twitter
			//
			if (twitter_on) {
				var text = options.services.twitter.tweet_text;
				if (typeof text === 'function') {
					text = text();
				}
				// 120 is the max character count left after twitters automatic url shortening with t.co
				text = abbreviateText(text, '120');
				var twitter_enc_uri = encodeURIComponent(uri + options.services.twitter.referrer_track);
				var twitter_count_url = encodeURIComponent(uri);
				var twitter_code = new IFrame({ allowtransparency: true, frameborder:0, scrolling: 'no', src:'http://platform.twitter.com/widgets/tweet_button.html?url=' + twitter_enc_uri + '&counturl=' + twitter_count_url + '&text=' + text + '&count=horizontal&lang=' + options.services.twitter.language, styles: { width:130, height:25 }});
				var twitter_dummy_btn = new Element('img.tweet_this_dummy', { src: options.services.twitter.dummy_img, alt: '&quot;Tweet this&quot;-Dummy'});

				context.grab(new Element('li.twitter.help_info', { html: '<span class="info">' + options.services.twitter.txt_info + '</span><span class="switch off">' + options.services.twitter.txt_twitter_off + '</span><div class="tweet dummy_btn"></div>' }));
				var $container_tw = context.getElement('li.twitter');
				$container_tw.getElement('.tweet').grab(twitter_dummy_btn);
				
				var twitterClickFunction =  function () {
					if ($container_tw.getElement('span.switch').hasClass('off')) {
						$container_tw.addClass('info_off');
						$container_tw.getElement('span.switch').addClass('on').removeClass('off').set('html', options.services.twitter.txt_twitter_on);
						$container_tw.getElement('.tweet').empty().grab(twitter_code);
					} else {
						$container_tw.removeClass('info_off');
						$container_tw.getElement('span.switch').addClass('off').removeClass('on').set('html', options.services.twitter.txt_twitter_off);
						$container_tw.getElement('.tweet').empty().grab(twitter_dummy_btn);
					}
				}.bind(this);

				context.getElement('li.twitter div.tweet img').addEvent('click', twitterClickFunction);
				context.getElement('li.twitter span.switch').addEvent('click', twitterClickFunction);
			}

			//
			// Google+
			//
			if (gplus_on) {
				// fuer G+ wird die URL nicht encoded, da das zu einem Fehler fuehrt
				var gplus_uri = uri + options.services.gplus.referrer_track;
				
				// we use the Google+ "asynchronous" code, standard code is flaky if inserted into dom after load
				var gplus_div = new Element('div.g-plusone', { 'data-size': 'medium', 'data-href': gplus_uri });
				var gplus_code = new Element('script', { type: 'text/javascript', html: 'window.___gcfg = {lang: "' + options.services.gplus.language + '"}; (function() { var po = document.createElement("script"); po.type = "text/javascript"; po.async = true; po.src = "https://apis.google.com/js/plusone.js"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s); })();' });
				var gplus_dummy_btn = new Element('img.gplus_one_dummy', { src: options.services.gplus.dummy_img, alt: '&quot;Google+1&quot;-Dummy'});

				context.grab(new Element('li.gplus.help_info', { html: '<span class="info">' + options.services.gplus.txt_info + '</span><span class="switch off">' + options.services.gplus.txt_gplus_off + '</span><div class="gplusone dummy_btn"></div>' }));
				var $container_gplus = context.getElement('li.gplus');
				$container_gplus.getElement('.gplusone').grab(gplus_dummy_btn);

				var gplusClickFunction = function () {
					if ($container_gplus.getElement('span.switch').hasClass('off')) {
						$container_gplus.addClass('info_off');
						$container_gplus.getElement('span.switch').addClass('on').removeClass('off').set('html', options.services.gplus.txt_gplus_on);
						$container_gplus.getElement('.gplusone').empty().grab(gplus_div).grab(gplus_code);
					} else {
						$container_gplus.removeClass('info_off');
						$container_gplus.getElement('span.switch').addClass('off').removeClass('on').set('html', options.services.gplus.txt_gplus_off);
						$container_gplus.getElement('.gplusone').empty().grab(gplus_dummy_btn);
					}
				}.bind(this);

				context.getElement('li.gplus div.gplusone img').addEvent('click', gplusClickFunction);
				context.getElement('li.gplus span.switch').addEvent('click', gplusClickFunction);
			}

			//
			// Der Info/Settings-Bereich wird eingebunden
			//
			context.grab(new Element('li.settings_info', { html: '<div class="settings_info_menu off perma_option_off"><a href="' + options.info_link + '"><span class="help_info icon"><span class="info">' + options.txt_help + '</span></span></a></div>' }));

			// Info-Overlays mit leichter Verzoegerung einblenden
			context.getElements('.help_info:not(.info_off)').each(function(service) {
				service.addEvent('mouseenter', function () {
					var $info_wrapper = document.id(this);
					var timeout_id = function () { $info_wrapper.addClass('display'); }.delay(500);
					$info_wrapper.store('timeout_id', timeout_id);
				})
			});
			context.getElements('.help_info').each(function(service) {
				service.addEvent('mouseleave', function () {
					var $info_wrapper = document.id(this);
					var timeout_id = $info_wrapper.retrieve('timeout_id');
					window.clearTimeout(timeout_id);
					if ($info_wrapper.hasClass('display')) {
						$info_wrapper.removeClass('display');
					}
				})
			});

			var facebook_perma = (options.services.facebook.perma_option === 'on');
			var twitter_perma  = (options.services.twitter.perma_option  === 'on');
			var gplus_perma    = (options.services.gplus.perma_option    === 'on');

			// Menue zum dauerhaften Einblenden der aktiven Dienste via Cookie einbinden
			// Die IE7 wird hier ausgenommen, da er kein JSON kann und die Cookies hier ueber JSON-Struktur abgebildet werden
			if (((facebook_on && facebook_perma)
				|| (twitter_on && twitter_perma)
				|| (gplus_on && gplus_perma))
					&& (!Browser.ie || (Browser.ie && Browser.version > 7.0))) {

				// Cookies abrufen
				var cookie_list = document.cookie.split(';');
				var cookies = '{';
				// Nur wenn cookies vorhanden sind
				if (document.cookie.trim() !== "") {
					var i = 0;
					for (; i < cookie_list.length; i += 1) {
						var foo = cookie_list[i].split('=');
						cookies += '"' + (foo[0]).trim() + '":"' + (foo[1]).trim() + '"';
						if (i < cookie_list.length - 1) {
							cookies += ',';
						}
					}
				}
				cookies += '}';
				cookies = JSON.decode(cookies);

				// Container definieren
				var $container_settings_info = context.getElement('li.settings_info');

				// Klasse entfernen, die das i-Icon alleine formatiert, da Perma-Optionen eingeblendet werden
				$container_settings_info.getElement('.settings_info_menu').removeClass('perma_option_off');

				// Perma-Optionen-Icon (.settings) und Formular (noch versteckt) einbinden
				$container_settings_info.getElement('.settings_info_menu').grab(new Element('span.settings', { html: 'Einstellungen' }));
				$container_settings_info.getElement('.settings_info_menu').grab(new Element('form', { html: '<fieldset><legend>' + options.settings_perma + '</legend></fieldset>' }));



				// Die Dienste mit <input> und <label>, sowie checked-Status laut Cookie, schreiben
				var checked = ' checked="checked"';
				if (facebook_on && facebook_perma) {
					var perma_status_facebook = cookies.socialSharePrivacy_facebook === 'perma_on' ? checked : '';
					$container_settings_info.getElement('form fieldset').grab(new Element('input#perma_status_facebook', { type: 'checkbox', name: 'perma_status_facebook', checked: perma_status_facebook }));
					$container_settings_info.getElement('form fieldset').grab(new Element('label', { type: 'checkbox', 'for': 'perma_status_facebook', html: options.services.facebook.display_name }));
				}

				if (twitter_on && twitter_perma) {
					var perma_status_twitter = cookies.socialSharePrivacy_twitter === 'perma_on' ? checked : '';
					$container_settings_info.getElement('form fieldset').grab(new Element('input#perma_status_twitter', { type: 'checkbox', name: 'perma_status_twitter', checked: perma_status_twitter }));
					$container_settings_info.getElement('form fieldset').grab(new Element('label', { type: 'checkbox', 'for': 'perma_status_twitter', html: options.services.twitter.display_name }));
				}

				if (gplus_on && gplus_perma) {
					var perma_status_gplus = cookies.socialSharePrivacy_gplus === 'perma_on' ? checked : '';
					$container_settings_info.getElement('form fieldset').grab(new Element('input#perma_status_gplus', { type: 'checkbox', name: 'perma_status_gplus', checked: perma_status_gplus }));
					$container_settings_info.getElement('form fieldset').grab(new Element('label', { type: 'checkbox', 'for': 'perma_status_gplus', html: options.services.gplus.display_name }));
				}

				// Cursor auf Pointer setzen fuer das Zahnrad
				$container_settings_info.getElement('span.settings').setStyle('cursor', 'pointer');

				// Einstellungs-Menue bei mouseover ein-/ausblenden
				$container_settings_info.getElement('span.settings').addEvent('mouseenter', function () {
					var timeout_id = function () { $container_settings_info.getElement('.settings_info_menu').removeClass('off').addClass('on'); }.delay(500);
					this.store('timeout_id', timeout_id);
				}); 
				$container_settings_info.addEvent('mouseleave', function () {
					var timeout_id = this.retrieve('timeout_id');
					window.clearTimeout(timeout_id);
					$container_settings_info.getElement('.settings_info_menu').removeClass('on').addClass('off');
				});

				// Klick-Interaktion auf <input> um Dienste dauerhaft ein- oder auszuschalten (Cookie wird gesetzt oder geloescht)
				$container_settings_info.getElements('fieldset input').each(function(element) {
					element.addEvent('click', function (event) {
						var click = event.target.id;
						var service = click.substr(click.lastIndexOf('_') + 1, click.length);
						var cookie_name = 'socialSharePrivacy_' + service;

						if (document.getElements('#' + event.target.id + ':checked').length) {
							cookieSet(cookie_name, 'perma_on', options.cookie_expires, options.cookie_path, options.cookie_domain);
							document.getElement('form fieldset label[for=' + click + ']').addClass('checked');
						} else {
							cookieDel(cookie_name, 'perma_on', options.cookie_path, options.cookie_domain);
							document.getElement('form fieldset label[for=' + click + ']').removeClass('checked');
						}
					})
				}.bind(this));

				// Dienste automatisch einbinden, wenn entsprechendes Cookie vorhanden ist
				if (facebook_on && facebook_perma && cookies.socialSharePrivacy_facebook === 'perma_on') {
					document.getElement('li.facebook span.switch').fireEvent('click');
				}
				if (twitter_on && twitter_perma && cookies.socialSharePrivacy_twitter === 'perma_on') {
					document.getElement('li.twitter span.switch').fireEvent('click');
				}
				if (gplus_on && gplus_perma && cookies.socialSharePrivacy_gplus === 'perma_on') {
					document.getElement('li.gplus span.switch').fireEvent('click');
				}
			}
		}      // $.fn.socialSharePrivacy = function (settings) {
	});
})();

