try:
    from supabase import create_client, Client
except ImportError:
    print("Warning: supabase-py not installed (likely build error). Using MockClient.")
    class Client:
        def __init__(self, *args, **kwargs): pass
        def table(self, T): return self
        def select(self, *args): return self
        def eq(self, *args): return self
        def single(self): return self
        def insert(self, *args): return self
        def update(self, *args): return self
        def execute(self): 
            class Res: data = []
            return Res()
        @property
        def auth(self): 
            class Auth:
                def get_user(self, token): 
                    class U: user = type('obj', (object,), {'id': 'mock-id'})
                    return U()
            return Auth()
        @property
        def storage(self):
            class Storage:
                def from_(self, B): 
                    class Bucket:
                        def download(self, P): return b"Mock Content"
                    return Bucket()
            return Storage()
    
    def create_client(u, k): return Client()

from .config import settings

def get_supabase() -> Client:
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY
    return create_client(url, key)
