from django import template

register = template.Library()


@register.filter
def width_percent(needed):
    """
    Quick helper for request progress bars:
    map remaining swipes (int) to a pseudo-percentage.
    """
    if needed is None:
        return 0
    needed = max(0, int(needed))
    if needed == 0:
        return 100
    pct = max(8, 100 - min(needed, 10) * 8)
    return min(100, pct)
