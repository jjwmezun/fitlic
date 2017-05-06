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

if ( typeof isNumeric !== 'function' ) { 
	var isNumeric = function( n ) {
		return !isNaN( parseFloat(n) ) && isFinite( n );
	}
}

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

FitLic.drawOutput = function( data )
{
	var canvas = new JW( 'fitlic_canvas' );
	var text = '';
	
	var section_methods =
	[
		this.wordCreativity,
		this.averageWordLength,
		this.adverbs
	];
	
	section_methods.forEach
	(
		function( v )
		{
			text += FitLic.renderSect( v, data );
		}
	);

	canvas.change( text );
};

FitLic.renderSect = function( f, data )
{
	return f( data );
};

FitLic.averageWordLength = function( data )
{
	var longest_words = data.longestWords();
	var modes = data.modeWordLength();

	var text = `
		<h3>Average Word Length</h3>
			<p>${ data.averageWordLength() } letters</p>`;
			
	text += '<h3>Mode</h3>';
	
	if ( modes.multiple )
	{
		
	}
	else
	{
		text += `<p>${ modes.fst } letters ( ${ modes.instances } different words )`;
	}
			
	text += `<h3>Longest Words</h3>
			<p>Longest Word Length: ${ longest_words.max }</p>
	`;
	
	if ( longest_words.words.length > 0 )
	{
		text += '<ul>';
			longest_words.words.forEach
			(
				function( v )
				{
					text += `<li>${ v }</li>`;
				}
			);
		text += '</ul>';
	}
	return text;
};

FitLic.adverbs = function( data )
{
	var text = '';
	var adverbs = data.adverbs();
	
	text += '<h3>Adverbs</h3>';
	if ( adverbs.number > 0 )
	{
		text += `<p>Number o' unique adverbs: ${ adverbs.number }</p>`;
		text += `<p>Number o' adverbs total: ${ adverbs.total_number }</p>`;
		text += '<ul>';
			text += adverbs.each
			(
				function( v )
				{
					return `<li>${ v }</li>`;
				}
			)
		text += '</ul>';
	}
	else
	{
		text += '<p>&iexcl;How did you manage to write something without any adverbs?</p>';
	}
	
	text += `<p>Percent o&rsquo; word list: ${ adverbs.percent_words }</p>`;
	text += `<p>Percent o&rsquo; total text: ${ adverbs.percent_total }</p>`;
	return text;
};

FitLic.wordCreativity = function( data )
{
	var text = '<h2>Word Creativity</h2><table class="fitlic-word-use"><tr><th>Word</th><th>Instances</th><th>% o&rsquo; Total</th></tr><tr>';

	text += data.each
	(
		function( self, k, v )
		{
			var text = '';
			var quality_class = FitLic.qualityClass( v );

			text += `<tr${ quality_class }>`;
				text += `<td class="fitlic-col-word">${ k }</td>`;
				text += `<td class="fitlic-col-num-o-uses">${ v }</td>`;
				text += `<td class="fitlic-col-percent">${ self.wordPercent( k ) }</td>`;
			text += '</tr>';
			return text;
		}
	);

	text += '</tr></table>';
	
	text += '<h3>General Word Creativity:</h3>';
	text += `<p>${ data.generalCreativity() }</p>`;
	return text;
};

FitLic.analyze = function()
{
	var word_count = 0;
	var words_counted = {};
	var text_words = [];
	var text = new JW( 'fitlic_input' ).content();

	text = text.replace( /\n/g, " " );
	text = text.replace( /-/g, " " );
	text = text.replace( /[\s]*\/[\s]*/g, " " );
	text = text.replace( /[^a-za-zA-Z'’\s0-9&@]*/g, "" );
	text = text.replace( /'/g, "’" );
	text = text.replace( /’s\s/g, " " );
	text = text.replace( /’\s/g, " " );
	text = text.toLowerCase();
	text_words = text.split( /[\s]+/ );
	word_count = text_words.length;

	text_words.forEach
	(
		function( v )
		{
			if ( undefined === words_counted[ v ] )
			{
				words_counted[ v ] = 1;
			}
			else if ( isNumeric( words_counted[ v ] ) )
			{
				words_counted[ v ]++;
			}
		}
	);

	FitLic.drawOutput( new WordData( words_counted, word_count ) );
};

new JW( 'fitlic_submit' ).bind( 'click', FitLic.analyze );
var WordData = {};

WordData = function( word_list, word_count )
{
	this.word_list = word_list;
	this.total_word_count = word_count;	
	
	var sortMethod = function( obj )
	{
		return Object.keys( obj ).sort( function( a, b ){ return obj[ a ] - obj[ b ] } ).reverse();
	};
	
	this.sorter = sortMethod( this.word_list );
};

WordData.prototype.percentFormat = function( a, b, show_calc, atag, btag )
{
	if ( show_calc === undefined ) { show_calc = true; }
	var text = '';

	if ( show_calc )
	{
		text += a.toLocaleString() + ( ( atag ) ? ` ${ atag } ` : '' );
		text += ' / ';
		text += b.toLocaleString() + ( ( btag ) ? ` ${ btag } ` : '' );
		text += ' &ndash; ';
	}
	
	text += `${ ( ( a / b ) * 100 ).toString().substr( 0, 5 ) }%`;
	return text;
};

WordData.prototype.wordPercent = function( word )
{
	return this.percentFormat( this.word_list[ word ], this.total_word_count, false );
};

WordData.prototype.generalCreativity = function()
{
	return this.percentFormat( this.sorter.length, this.total_word_count, true, 'unique words' );
};

WordData.prototype.each = function( f )
{
	// JS can't order objects correctly, so we have to create an indexed array with all data's values,
	// in order o' that object's values,
	// & then we iterator o'er the sorted INDEXED array & get the INDEXED array's VALUE to use as the KEY for the OBJECT / ASSOCIATED array.
	// All 'cause JS was too dumb to have properly ordered objects.
	var k = 0;
	var v = '';
	var output = '';
	for ( var i = 0; i < this.sorter.length; i++ )
	{
		k = this.sorter[ i ];
		v = this.word_list[ k ];
		output += f( this, k, v );
	}
	return output;
};

WordData.prototype.totalWordLetters = function()
{
	var total_word_letters = 0;
	
	for ( k in this.word_list )
	{
		if ( this.word_list.hasOwnProperty( k ) )
		{
			total_word_letters += k.length;
		}
	}
	return total_word_letters;
};

WordData.prototype.longestWords = function()
{
	var words = [];
	var max = 0;
	
	for ( k in this.word_list )
	{
		if ( this.word_list.hasOwnProperty( k ) )
		{
			if ( k.length > max )
			{
				words = [ k ];
				max = k.length;
			}
			else if ( k.length === max )
			{
				words.push( k );
			}
		}
	}
	
	return { words: words, max: max };
};

WordData.prototype.averageWordLength = function()
{
	return Math.round( this.totalWordLetters() / this.sorter.length );
};

WordData.prototype.modeWordLength = function()
{
	var modes = [];
	var max_instances = 0;
	var lengths = {};
	
	for ( var k in this.word_list )
	{
		if ( this.word_list.hasOwnProperty( k ) )
		{
			if ( lengths[ k.length ] === undefined )
			{
				lengths[ k.length ] = 1;
			}
			else
			{
				lengths[ k.length ]++;
			}
		}
	}
	
	
	for ( var i in lengths )
	{
		if ( lengths.hasOwnProperty( i ) )
		{
			if ( lengths[ i ] > max_instances )
			{
				modes = [ i ];
				max_instances = lengths[ i ];
			}
			else if ( lengths[ i ] === max_instances )
			{
				modes.push( i );
			}
		}
	}
	
	return {
		modes: modes,
		fst: modes[ 0 ],
		multiple: modes.length > 1,
		instances: max_instances
	};
};

WordData.prototype.adverbs = function()
{
	var adverbs = [];
	var total_number = 0;

	for ( k in this.word_list )
	{
		if ( this.word_list.hasOwnProperty( k ) )
		{
			if ( k.match( /^[a-z]*ly$/ ) !== null )
			{
				adverbs.push( k );
				total_number += this.word_list[ k ];
			}
		}
	}

	return {
		number: adverbs.length,
		total_number: total_number,
		percent_words: this.percentFormat( adverbs.length, this.sorter.length ),
		percent_total: this.percentFormat( total_number, this.total_word_count ),
		each: function( f )
		{
			var text = '';
			for ( k in adverbs )
			{
				text += f( adverbs[ k ] );
			}
			return text;
		}
	};
};