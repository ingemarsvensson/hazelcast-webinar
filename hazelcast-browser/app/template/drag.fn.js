(function($) {
	$.fn.drags = function(opt) {
		opt = $.extend({handle:"",cursor:"ew-resize", min:10, direction:'horizontal'}, opt);
		if(opt.handle === "") {
			var $el = this;
		} else {
			var $el = this.find(opt.handle);
		}

		var priorCursor = $('body').css('cursor');

		return $el.css('cursor', opt.cursor).on("mousedown", function(e) {

			priorCursor = $('body').css('cursor');
			$('body').css('cursor', opt.cursor);

			if(opt.handle === "") {
				var $drag = $(this).addClass('draggable');
			} else {
				var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
			}
			var z_idx = $drag.css('z-index'),
				drg_h = $drag.outerHeight(),
				drg_w = $drag.outerWidth(),
				pos_y = $drag.offset().top + drg_h - e.pageY,
				pos_x = $drag.offset().left + drg_w - e.pageX;
			$drag.css('z-index', 1000).parents().on("mousemove", function(e) {
				var prev = $('.draggable').prev();
				var next = $('.draggable').next();

				if (!prev.offset()) return;

				// Assume 50/50 split between prev and next then adjust to
				// the next X for prev

				switch(opt.direction) {
					case "vertical":
						var total = prev.outerHeight() + next.outerHeight();
						var topPercentage = (((e.pageY - prev.offset().top) + (pos_y-drg_h / 2)) / total);
						var bottomPercentage = 1 - topPercentage;
						if (topPercentage * 100 < opt.min || bottomPercentage * 100 < opt.min) {
							return;
						}
						prev.css('flex', topPercentage.toString());
						next.css('flex', bottomPercentage.toString());
						prev.css('-webkit-flex', topPercentage.toString());
						next.css('-webkit-flex', bottomPercentage.toString());
						break;

					default:
						var total = prev.outerWidth() + next.outerWidth();
						var leftPercentage = (((e.pageX - prev.offset().left) + (pos_x - drg_w / 2)) / total);
						var rightPercentage = 1 - leftPercentage;
						if(leftPercentage * 100 < opt.min || rightPercentage * 100 < opt.min) {
							return;
						}
						prev.css('flex', leftPercentage.toString());
						next.css('flex', rightPercentage.toString());
						prev.css('-webkit-flex', leftPercentage.toString());
						next.css('-webkit-flex', rightPercentage.toString());

				}

				$(document).on("mouseup", function() {
					$('body').css('cursor', priorCursor);
					$('.draggable').removeClass('draggable').css('z-index', z_idx);
				});
			});
			e.preventDefault(); // disable selection
		});

	}
})(jQuery);

$(function() {

});
