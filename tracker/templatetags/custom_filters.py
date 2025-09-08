from django import template

register = template.Library()

@register.filter(name='replace')
def replace(value, arg):
    """
    Replaces all occurrences of a substring with another substring.
    Usage: {{ value|replace:"old:new" }}
    """
    if not value:
        return value
        
    try:
        if ':' in arg:
            old, new = arg.split(':', 1)
            return str(value).replace(old, new)
        return str(value).replace(arg, '')
    except (ValueError, AttributeError):
        return value
