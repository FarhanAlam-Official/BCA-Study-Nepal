from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

class DownloadRateThrottle(UserRateThrottle):
    scope = 'download'

class CustomAnonRateThrottle(AnonRateThrottle):
    def get_cache_key(self, request, view):
        if request.META.get('HTTP_X_FORWARDED_FOR'):
            ident = request.META.get('HTTP_X_FORWARDED_FOR')
        else:
            ident = request.META.get('REMOTE_ADDR', '')

        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        } 