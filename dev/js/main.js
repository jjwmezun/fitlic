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