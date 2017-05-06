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