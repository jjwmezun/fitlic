/* =BOOTLEG JQUERY: JWeary
=====================================================*/

	function JW( id )
	{
		this.id = id;
		this.obj = document.getElementById( id );
	}

	JW.prototype.content = function()
	{
		if ( "textarea" === this.obj.tagName.toLowerCase() )
		{
			return this.obj.value;
		}
		else
		{
			return this.obj.innerHTML;
		}
	}
	
	JW.prototype.append = function( stuff )
	{
		this.obj.innerHTML += stuff;
	}
	
	JW.prototype.change = function( stuff )
	{
		this.obj.innerHTML = stuff;
	}
	
	JW.prototype.bind = function( type, func )
	{
		this.obj.addEventListener( type, func );
	}
	
	JW.prototype.style = function( type )
	{
		return this.obj.style[ type ];
	}
	
	JW.prototype.fadeOut = function()
	{
		if ( 'none' !== this.obj.style.display )
		{
			var opacity = this.obj.style.opacity;

			var fade_func = ( function( opacity )
			{
				return function()
				{
					opacity -= 0.2;
					this.obj.style.opacity = Math.round( opacity );

					if ( this.obj.style.opacity <= 0 )
					{
						this.obj.style.display = 'none';
					}
					else
					{
						window.setInterval( this, 50 );
					}
				}
			} ) ( opacity );
		}
	}
var FitLic = {};

FitLic.qualityClass = function( v )
{
	var quality = 'many-word-uses';
	
	if ( 1 === v )
	{
		quality = '1-word-use';
	}
	else if ( 1 < v && v < 10 )
	{
		quality = 'few-word-uses';
	}
	else if ( 9 < v && v < 25 )
	{
		quality = 'some-word-uses';
	}

	return ` class="fitlic-${ quality }"`;
};

FitLic.sort = function( obj )
{
	return Object.keys( obj ).sort( function( a, b ){ return obj[a] - obj[b] } ).reverse();
};

FitLic.drawOutput = function( data )
{
	var quality_class = '';
	var prop;
	var i = 0;
	var canvas = new JW( 'fitlic_canvas' );
	var text = '<table class="fitlic-word-use"><tr>';

	// JS can't order objects correctly, so we have to create an indexed array with all data's values,
	// in order o' that object's values,
	// & then we iterator o'er the sorted INDEXED array & get the INDEXED array's VALUE to use as the KEY for the OBJECT / ASSOCIATED array.
	// All 'cause JS was too dumb to have properly ordered objects.
	var word_array = this.sort( data );
	for ( i in word_array )
	{
		prop = word_array[ i ];
		quality_class = this.qualityClass( data[ prop ] );
		text += `<tr${ quality_class }>`;
			text += `<td>${ prop }</td>`;
			text += `<td>${ data[ prop ] }</td>`;
		text += '</tr>';
	}

	text += '</tr></table>';
	canvas.change( text );
	console.log( text );
};

FitLic.analyze = function()
{
	var words_counted = {};
	var text_words = [];
	var text = new JW( 'fitlic_input' ).content();

	text = text.replace( /\n/g, " " );
	text = text.replace( /[^a-za-zA-Z'’\s]*/g, "" );
	text = text.replace( /'/g, "’" );
	text = text.toLowerCase();
	text_words = text.split( /[\s]+/ );

	text_words.forEach
	(
		function( v )
		{
			if ( undefined === words_counted[ v ] )
			{
				words_counted[ v ] = 1;
			}
			else
			{
				words_counted[ v ]++;
			}
		}
	);

	FitLic.drawOutput( words_counted );
};

new JW( 'fitlic_submit' ).bind( 'click', FitLic.analyze );