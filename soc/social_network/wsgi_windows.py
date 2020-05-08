


'''activate_this = 'C:/Users/kk/Google Drive/social_network/soc_env/Scripts/activate'
# execfile(activate_this, dict(__file__=activate_this))
exec(open(activate_this).read(),dict(__file__=activate_this))'''

import os
import sys
import site

# Add the site-packages of the chosen virtualenv to work with
site.addsitedir('C:/Users/kk/Google Drive/social_network/soc_env/Lib/site-packages')




# Add the app's directory to the PYTHONPATH
sys.path.append('C:/Users/kk/Google Drive/social_network')
sys.path.append('C:/Users/kk/Google Drive/social_network')

os.environ['DJANGO_SETTINGS_MODULE'] = 'social_network.settings'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "social_network.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
