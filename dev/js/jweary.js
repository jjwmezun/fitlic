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